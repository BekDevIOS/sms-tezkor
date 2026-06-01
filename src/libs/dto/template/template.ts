import { TemplateStatus } from '../../enums/template.enum';

export class Template {
  _id: string;
  memberId: string;
  name: string;
  body: string;
  variables: string[];
  locale?: string;
  status: TemplateStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Templates {
  list: Template[];
  total: number;
}
