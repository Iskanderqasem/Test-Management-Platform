import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { RequirementsService, RequirementQueryParams } from './requirements.service';
import { CreateRequirementDto, UpdateRequirementDto } from './dto/create-requirement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Requirements')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all requirements with filtering' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'priority', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of requirements' })
  async findAll(@Query() query: RequirementQueryParams) {
    return this.requirementsService.findAll(query);
  }

  @Get('project/:projectId/stats')
  @ApiOperation({ summary: 'Get requirement statistics for a project' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Requirement statistics' })
  async getStats(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.requirementsService.getStats(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all requirements for a project' })
  @ApiParam({ name: 'projectId', type: 'string', format: 'uuid' })
  async findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.requirementsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get requirement by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Requirement details' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requirementsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new requirement' })
  @ApiResponse({ status: 201, description: 'Requirement created' })
  async create(@Body() createDto: CreateRequirementDto, @Req() req: Request) {
    const currentUser = (req as any).user;
    return this.requirementsService.create(createDto, currentUser);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload requirements document (PDF, DOCX, XLSX, TXT)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        projectId: { type: 'string', format: 'uuid' },
        sourceDocument: { type: 'string' },
      },
      required: ['file', 'projectId'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/requirements',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadRequirements(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
    @Body('sourceDocument') sourceDocument: string,
    @Req() req: Request,
  ) {
    const currentUser = (req as any).user;

    // In production, parse the file content here
    return {
      message: 'File uploaded successfully. Processing requirements...',
      filename: file.originalname,
      path: file.path,
      projectId,
      sourceDocument,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update requirement' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Requirement updated' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRequirementDto,
  ) {
    return this.requirementsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete requirement' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Requirement deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.requirementsService.remove(id);
  }
}
