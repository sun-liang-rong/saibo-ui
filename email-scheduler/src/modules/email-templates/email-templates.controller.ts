import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmailTemplatesService } from './email-templates.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@ApiTags('templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('templates')
export class EmailTemplatesController {
  constructor(private readonly templatesService: EmailTemplatesService) {}

  @Post()
  @ApiOperation({ summary: '创建邮件模板' })
  create(@Body() createDto: CreateEmailTemplateDto) {
    return this.templatesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有邮件模板' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: '每页数量' })
  findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.templatesService.findAll(page, pageSize);
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有邮件模板（全量，不分页）' })
  findAllWithoutPagination() {
    return this.templatesService.findAllWithoutPagination();
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑邮件模板' })
  update(@Param('id') id: string, @Body() updateDto: UpdateEmailTemplateDto) {
    return this.templatesService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除邮件模板' })
  remove(@Param('id') id: string) {
    return this.templatesService.remove(+id);
  }
}
