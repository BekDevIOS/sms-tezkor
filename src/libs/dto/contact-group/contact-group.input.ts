import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateContactGroupDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  color?: string;
}

export class UpdateContactGroupDto extends CreateContactGroupDto {}
