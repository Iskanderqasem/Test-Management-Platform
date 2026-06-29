import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestCase } from './test-case.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectRepository(TestCase) private repo: Repository<TestCase>,
    private aiService: AiService,
  ) {}

  findAll(projectId?: string) {
    const where = projectId ? { projectId } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const tc = await this.repo.findOne({ where: { id } });
    if (!tc) throw new NotFoundException('Test case not found');
    return tc;
  }

  create(data: Partial<TestCase>) {
    const tc = this.repo.create(data);
    return this.repo.save(tc);
  }

  async update(id: string, data: Partial<TestCase>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Deleted' };
  }

  async generateWithAI(source: string, sourceType: string, testTypes: string[], projectId: string, context?: string) {
    const generatedCases = await this.aiService.generateTestCases(source, sourceType, testTypes, context);
    const saved = await Promise.all(
      generatedCases.map((tc: any) =>
        this.repo.save(this.repo.create({ ...tc, projectId, isAiGenerated: true, status: 'Not Run' }))
      )
    );
    return saved;
  }

  async getStats(projectId: string) {
    const all = await this.findAll(projectId);
    return {
      total: all.length,
      pass: all.filter((t) => t.status === 'Pass').length,
      fail: all.filter((t) => t.status === 'Fail').length,
      blocked: all.filter((t) => t.status === 'Blocked').length,
      notRun: all.filter((t) => t.status === 'Not Run').length,
      automated: all.filter((t) => t.automationFlag).length,
    };
  }
}
