import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private templateRepository: Repository<EmailTemplate>,
  ) {}

  async create(createDto: CreateEmailTemplateDto): Promise<EmailTemplate> {
    const template = this.templateRepository.create(createDto);
    return await this.templateRepository.save(template);
  }

  async findAll(page?: string, pageSize?: string): Promise<{ data: EmailTemplate[]; total: number; page: number; pageSize: number }> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const size = pageSize ? parseInt(pageSize, 10) : 10;

    const [data, total] = await this.templateRepository.findAndCount({
      order: { created_at: 'DESC' },
      skip: (pageNum - 1) * size,
      take: size,
    });

    return {
      data,
      total,
      page: pageNum,
      pageSize: size,
    };
  }

  async findAllWithoutPagination(): Promise<EmailTemplate[]> {
    return await this.templateRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<EmailTemplate | null> {
    return await this.templateRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    await this.templateRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.templateRepository.delete(id);
  }
}
