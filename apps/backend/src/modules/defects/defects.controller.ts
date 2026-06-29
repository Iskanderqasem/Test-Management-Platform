import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DefectsService } from './defects.service';
import { Defect } from './defect.entity';

@ApiTags('Defects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('defects')
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all defects' })
  findAll(@Query('projectId') projectId?: string) {
    return this.defectsService.findAll(projectId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get defect statistics' })
  getStats(@Query('projectId') projectId?: string) {
    return this.defectsService.getStats(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get defect by ID' })
  findOne(@Param('id') id: string) {
    return this.defectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new defect' })
  create(@Body() data: Partial<Defect>) {
    return this.defectsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update defect' })
  update(@Param('id') id: string, @Body() data: Partial<Defect>) {
    return this.defectsService.update(id, data);
  }

  @Post(':id/analyze-root-cause')
  @ApiOperation({ summary: 'AI root cause analysis for defect' })
  analyzeRootCause(@Param('id') id: string, @Body() body: { logs?: string }) {
    return this.defectsService.analyzeRootCause(id, body.logs);
  }

  @Post(':id/export-ado')
  @ApiOperation({ summary: 'Export defect to Azure DevOps' })
  exportToADO(@Param('id') id: string) {
    return this.defectsService.exportToADO(id);
  }
}
