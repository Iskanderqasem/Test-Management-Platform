import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TestCasesService } from './test-cases.service';
import { TestCase } from './test-case.entity';

@ApiTags('Test Cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all test cases' })
  findAll(@Query('projectId') projectId?: string) {
    return this.testCasesService.findAll(projectId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get test case statistics' })
  getStats(@Query('projectId') projectId: string) {
    return this.testCasesService.getStats(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test case by ID' })
  findOne(@Param('id') id: string) {
    return this.testCasesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create test case manually' })
  create(@Body() data: Partial<TestCase>) {
    return this.testCasesService.create(data);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate test cases using AI' })
  generate(@Body() body: { source: string; sourceType: string; testTypes: string[]; projectId: string; context?: string }) {
    return this.testCasesService.generateWithAI(body.source, body.sourceType, body.testTypes, body.projectId, body.context);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update test case' })
  update(@Param('id') id: string, @Body() data: Partial<TestCase>) {
    return this.testCasesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete test case' })
  remove(@Param('id') id: string) {
    return this.testCasesService.remove(id);
  }
}
