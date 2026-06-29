import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Requirement, RequirementStatus } from './requirement.entity';
import { CreateRequirementDto, UpdateRequirementDto } from './dto/create-requirement.dto';
import { User } from '../users/user.entity';

export interface RequirementQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  projectId?: string;
}

@Injectable()
export class RequirementsService {
  private readonly logger = new Logger(RequirementsService.name);

  constructor(
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>,
  ) {}

  async findAll(params: RequirementQueryParams = {}) {
    const { page = 1, limit = 50, search, type, status, priority, projectId } = params;
    const skip = (page - 1) * limit;

    const qb = this.requirementsRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.createdBy', 'createdBy');

    if (projectId) qb.andWhere('r.projectId = :projectId', { projectId });
    if (search) qb.andWhere('(r.title ILIKE :search OR r.description ILIKE :search)', { search: `%${search}%` });
    if (type) qb.andWhere('r.type = :type', { type });
    if (status) qb.andWhere('r.status = :status', { status });
    if (priority) qb.andWhere('r.priority = :priority', { priority });

    qb.orderBy('r.reqId', 'ASC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Requirement> {
    const req = await this.requirementsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'project'],
    });

    if (!req) {
      throw new NotFoundException(`Requirement with ID ${id} not found`);
    }

    return req;
  }

  async findByProject(projectId: string): Promise<Requirement[]> {
    return this.requirementsRepository.find({
      where: { projectId },
      order: { reqId: 'ASC' },
    });
  }

  async create(createDto: CreateRequirementDto, currentUser: User): Promise<Requirement> {
    const requirement = this.requirementsRepository.create({
      id: uuidv4(),
      ...createDto,
      createdById: currentUser.id,
    });

    const saved = await this.requirementsRepository.save(requirement);
    this.logger.log(`Requirement created: ${saved.reqId} - ${saved.title}`);

    return this.findById(saved.id);
  }

  async createBulk(requirements: Partial<Requirement>[], projectId: string, currentUser: User): Promise<Requirement[]> {
    const entities = requirements.map((req) => ({
      ...req,
      id: uuidv4(),
      projectId,
      createdById: currentUser.id,
    }));

    const saved = await this.requirementsRepository.save(entities as Requirement[]);
    this.logger.log(`Bulk created ${saved.length} requirements for project ${projectId}`);

    return saved;
  }

  async update(id: string, updateDto: UpdateRequirementDto): Promise<Requirement> {
    await this.findById(id);
    await this.requirementsRepository.update(id, updateDto as any);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const req = await this.findById(id);
    await this.requirementsRepository.delete(id);
    this.logger.log(`Requirement deleted: ${req.reqId}`);
  }

  async parseRequirementsFromText(text: string): Promise<Partial<Requirement>[]> {
    // Simple parsing logic - in production this would use NLP/AI
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    const requirements: Partial<Requirement>[] = [];

    lines.forEach((line, index) => {
      const match = line.match(/^(REQ[-_]?\d+[\w]*)[:\s]+(.+)$/i);
      if (match) {
        requirements.push({
          reqId: match[1].toUpperCase(),
          title: match[2].trim(),
          description: match[2].trim(),
        });
      } else if (line.match(/^\d+\./)) {
        requirements.push({
          reqId: `REQ-${String(index + 1).padStart(3, '0')}`,
          title: line.replace(/^\d+\.\s*/, '').trim(),
          description: line.replace(/^\d+\.\s*/, '').trim(),
        });
      }
    });

    return requirements;
  }

  async getStats(projectId: string): Promise<Record<string, any>> {
    const stats = await this.requirementsRepository
      .createQueryBuilder('r')
      .select('r.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('r.projectId = :projectId', { projectId })
      .groupBy('r.status')
      .getRawMany();

    const total = stats.reduce((sum, s) => sum + parseInt(s.count), 0);
    const byStatus = stats.reduce((acc, s) => ({ ...acc, [s.status]: parseInt(s.count) }), {});

    return {
      total,
      byStatus,
      covered: 0, // Would be populated from test case linkages
      uncovered: total,
      coveragePercent: 0,
    };
  }
}
