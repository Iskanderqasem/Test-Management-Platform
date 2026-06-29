import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectStatus } from './project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { User, UserRole } from '../users/user.entity';

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  ownerId?: string;
}

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(params: ProjectQueryParams = {}, currentUser?: User) {
    const { page = 1, limit = 20, search, status, ownerId } = params;
    const skip = (page - 1) * limit;

    const qb = this.projectsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.owner', 'owner')
      .select([
        'p',
        'owner.id',
        'owner.name',
        'owner.email',
        'owner.avatar',
      ])
      .where('p.isArchived = :archived', { archived: false });

    if (search) {
      qb.andWhere('(p.name ILIKE :search OR p.description ILIKE :search)', { search: `%${search}%` });
    }
    if (status) qb.andWhere('p.status = :status', { status });
    if (ownerId) qb.andWhere('p.ownerId = :ownerId', { ownerId });

    // Non-admin users only see their own projects (or where they're members)
    if (currentUser && currentUser.role === UserRole.VIEWER) {
      qb.andWhere('p.ownerId = :userId', { userId: currentUser.id });
    }

    qb.orderBy('p.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto, currentUser: User): Promise<Project> {
    const project = this.projectsRepository.create({
      id: uuidv4(),
      ...createProjectDto,
      ownerId: currentUser.id,
    });

    const saved = await this.projectsRepository.save(project);
    this.logger.log(`Project created: ${saved.name} by ${currentUser.email}`);

    return this.findById(saved.id);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, currentUser: User): Promise<Project> {
    const project = await this.findById(id);

    // Only owner or admin can update
    if (project.ownerId !== currentUser.id && currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MANAGER) {
      throw new ForbiddenException('You do not have permission to update this project');
    }

    await this.projectsRepository.update(id, updateProjectDto as any);
    this.logger.log(`Project updated: ${project.name}`);

    return this.findById(id);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const project = await this.findById(id);

    if (project.ownerId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the project owner or admin can delete a project');
    }

    // Soft delete
    await this.projectsRepository.update(id, { isArchived: true, status: ProjectStatus.ARCHIVED });
    this.logger.warn(`Project archived: ${project.name} by ${currentUser.email}`);
  }

  async getProjectStats(id: string): Promise<Record<string, any>> {
    await this.findById(id);

    // These would normally join with other tables
    // Placeholder for demonstration
    return {
      projectId: id,
      requirements: { total: 0, covered: 0, uncovered: 0 },
      testCases: { total: 0, passed: 0, failed: 0, blocked: 0, notRun: 0 },
      defects: { total: 0, open: 0, closed: 0, critical: 0 },
      testRuns: { total: 0, passed: 0, failed: 0, inProgress: 0 },
      coverage: 0,
      passRate: 0,
    };
  }

  async getDashboardStats(): Promise<Record<string, any>> {
    const [total, byStatus] = await Promise.all([
      this.projectsRepository.count({ where: { isArchived: false } }),
      this.projectsRepository
        .createQueryBuilder('p')
        .select('p.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('p.isArchived = :archived', { archived: false })
        .groupBy('p.status')
        .getRawMany(),
    ]);

    return {
      total,
      byStatus: byStatus.reduce((acc, r) => ({ ...acc, [r.status]: parseInt(r.count) }), {}),
    };
  }
}
