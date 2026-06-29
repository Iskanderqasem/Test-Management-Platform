import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('test-strategy')
  @ApiOperation({ summary: 'Generate complete Test Strategy document' })
  generateTestStrategy(@Body() body: { projectData: any; requirements: string[] }) {
    return this.aiService.generateTestStrategy(body.projectData, body.requirements);
  }

  @Post('test-plan')
  @ApiOperation({ summary: 'Generate complete Test Plan document' })
  generateTestPlan(@Body() body: { projectData: any; strategyHighlights: string }) {
    return this.aiService.generateTestPlan(body.projectData, body.strategyHighlights);
  }

  @Post('test-cases')
  @ApiOperation({ summary: 'Generate test cases from requirements/stories/APIs' })
  generateTestCases(@Body() body: { source: string; sourceType: string; testTypes: string[]; context?: string }) {
    return this.aiService.generateTestCases(body.source, body.sourceType, body.testTypes, body.context);
  }

  @Post('gap-analysis')
  @ApiOperation({ summary: 'Analyze requirements for gaps, conflicts, and risks' })
  analyzeGaps(@Body() body: { requirements: string[] }) {
    return this.aiService.analyzeRequirementGaps(body.requirements);
  }

  @Post('root-cause')
  @ApiOperation({ summary: 'Analyze defect root cause from data and logs' })
  analyzeRootCause(@Body() body: { defectData: any; logs?: string }) {
    return this.aiService.analyzeRootCause(body.defectData, body.logs);
  }

  @Post('analyze-logs')
  @ApiOperation({ summary: 'Analyze PCAP/SAS/application logs for failures' })
  analyzeLogs(@Body() body: { logs: string; logType: string }) {
    return this.aiService.analyzeLogs(body.logs, body.logType);
  }

  @Post('generate-email')
  @ApiOperation({ summary: 'Generate professional test completion email' })
  generateEmail(@Body() body: { type: string; data: any }) {
    return this.aiService.generateEmail(body.type, body.data);
  }

  @Post('generate-report')
  @ApiOperation({ summary: 'Generate test report (daily/weekly/release/execution)' })
  generateReport(@Body() body: { type: string; data: any }) {
    return this.aiService.generateReport(body.type, body.data);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI Test Manager assistant' })
  chat(@Body() body: { messages: Array<{ role: string; content: string }>; context: any }) {
    return this.aiService.chatWithAssistant(body.messages, body.context);
  }

  @Post('regression-impact')
  @ApiOperation({ summary: 'Analyze regression impact of changed components' })
  regressionImpact(@Body() body: { changedComponents: string[]; requirements: any[]; testCases: any[] }) {
    return this.aiService.performRegressionImpactAnalysis(body.changedComponents, body.requirements, body.testCases);
  }
}
