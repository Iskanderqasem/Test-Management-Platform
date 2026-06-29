import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './user.entity';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  department?: string;
  jobTitle?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: UserRole;
  department?: string;
  jobTitle?: string;
  phoneNumber?: string;
  avatar?: string;
  isActive?: boolean;
  preferences?: Record<string, any>;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  department?: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(params: UserQueryParams = {}): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, search, role, isActive, department } = params;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    if (department) where.department = department;

    const [data, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'name', 'role', 'avatar', 'department', 'jobTitle', 'isActive', 'lastLoginAt', 'createdAt'],
    });

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'avatar', 'department', 'jobTitle', 'phoneNumber', 'isActive', 'emailVerified', 'lastLoginAt', 'createdAt', 'updatedAt', 'preferences'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email);

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 12);

    const user = this.usersRepository.create({
      id: uuidv4(),
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      passwordHash,
      isActive: true,
    });

    const saved = await this.usersRepository.save(user);
    this.logger.log(`User created: ${saved.email}`);

    return this.findById(saved.id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    await this.usersRepository.update(id, updateUserDto);
    this.logger.log(`User updated: ${user.email}`);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);

    // Soft delete by deactivating
    await this.usersRepository.update(id, { isActive: false });
    this.logger.log(`User deactivated: ${user.email}`);
  }

  async hardDelete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.delete(id);
    this.logger.warn(`User permanently deleted: ${user.email}`);
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    await this.findById(id);
    await this.usersRepository.update(id, { avatar: avatarUrl });
    return this.findById(id);
  }

  async updatePreferences(id: string, preferences: Record<string, any>): Promise<User> {
    const user = await this.findById(id);
    const merged = { ...user.preferences, ...preferences };
    await this.usersRepository.update(id, { preferences: merged });
    return this.findById(id);
  }

  async getStats(): Promise<Record<string, any>> {
    const [total, active, byRole] = await Promise.all([
      this.usersRepository.count(),
      this.usersRepository.count({ where: { isActive: true } }),
      this.usersRepository
        .createQueryBuilder('u')
        .select('u.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .groupBy('u.role')
        .getRawMany(),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      byRole: byRole.reduce((acc, r) => ({ ...acc, [r.role]: parseInt(r.count) }), {}),
    };
  }
}
