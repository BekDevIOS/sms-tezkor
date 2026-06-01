import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Template, Templates } from '../../libs/dto/template/template';
import {
  CreateTemplateDto,
  TemplatesInquiry,
  UpdateTemplateDto,
} from '../../libs/dto/template/template.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { TemplateService } from './template.service';

@Controller('template')
@UseGuards(MemberAuthGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(@AuthMember('_id') memberId: string, @Body() input: CreateTemplateDto): Promise<Template> {
    return this.templateService.create(memberId, input);
  }

  @Get()
  getList(@AuthMember('_id') memberId: string, @Query() inquiry: TemplatesInquiry): Promise<Templates> {
    return this.templateService.getList(memberId, inquiry);
  }

  @Get('/:id')
  getOne(@AuthMember('_id') memberId: string, @Param('id') id: string): Promise<Template> {
    return this.templateService.getOne(memberId, id);
  }

  @Post('/:id')
  update(
    @AuthMember('_id') memberId: string,
    @Param('id') id: string,
    @Body() input: UpdateTemplateDto,
  ): Promise<Template> {
    return this.templateService.update(memberId, id, input);
  }

  @Post('/:id/delete')
  @HttpCode(200)
  remove(@AuthMember('_id') memberId: string, @Param('id') id: string) {
    return this.templateService.remove(memberId, id);
  }
}
