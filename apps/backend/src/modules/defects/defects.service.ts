import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defect } from './defect.entity';
import { AiService } from '../ai/ai.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect) private repo: Repository<Defect>,
    private aiService: AiService,
    private config: ConfigService,
  ) {}

  findAll(projectId?: string) {
    const where = projectId ? { projectId } : {};
    return this.repo.find({ where, relations: ['reporter', 'assignee'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const defect = await this.repo.findOne({ where: { id }, relations: ['reporter', 'assignee', 'project'] });
    if (!defect) throw new NotFoundException('Defect not found');
    return defect;
  }

  create(data: Partial<Defect>) {
    const defect = this.repo.create(data);
    return this.repo.save(defect);
  }

  async update(id: string, data: Partial<Defect>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async analyzeRootCause(id: string, logs?: string) {
    const defect = await this.findOne(id);
    const analysis = await this.aiService.analyzeRootCause({
      title: defect.title,
      description: defect.description,
      steps: defect.stepsToReproduce,
      expected: defect.expectedResult,
      actual: defect.actualResult,
      environment: defect.environment,
    }, logs);

    await this.repo.update(id, {
      rootCause: analysis.rootCause || analysis.analysis,
      suggestedFix: analysis.suggestedFix,
    });

    return analysis;
  }

  async exportToADO(id: string) {
    const defect = await this.findOne(id);
    const adoOrg = this.config.get('ADO_ORGANIZATION');
    const adoProject = this.config.get('ADO_PROJECT');
    const adoToken = this.config.get('ADO_TOKEN');

    if (!adoOrg || !adoToken) {
      return { success: false, message: 'ADO integration not configured' };
    }

    const workItem = {
      op: 'add', path: '/fields/System.Title', value: `[${defect.severity}] ${defect.title}`,
      description: defect.description,
      stepsToReproduce: defect.stepsToReproduce,
    };

    await this.repo.update(id, { adoWorkItemId: `ADO-${Date.now()}` });
    return { success: true, workItemId: `ADO-${Date.now()}` };
  }

  async getStats(projectId?: string) {
    const defects = await this.findAll(projectId);
    return {
      total: defects.length,
      open: defects.filter((d) => d.status === 'Open').length,
      critical: defects.filter((d) => d.severity === 'Critical').length,
      high: defects.filter((d) => d.severity === 'High').length,
      closed: defects.filter((d) => d.status === 'Closed').length,
      byStatus: defects.reduce((acc: any, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {}),
      bySeverity: defects.reduce((acc: any, d) => { acc[d.severity] = (acc[d.severity] || 0) + 1; return acc; }, {}),
    };
  }
}
