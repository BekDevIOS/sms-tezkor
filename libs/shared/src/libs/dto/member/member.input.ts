import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterInput {
  @IsEmail()
  memberEmail: string;

  @IsString()
  @MinLength(8)
  memberPassword: string;

  @IsString()
  @MinLength(1)
  memberFirstName: string;

  @IsOptional()
  @IsString()
  memberLastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  memberPhone?: string;

  @IsOptional()
  @IsString()
  memberCompanyName?: string;
}

export class LoginInput {
  @IsEmail()
  memberEmail: string;

  @IsString()
  @MinLength(1)
  memberPassword: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  memberFirstName?: string;

  @IsOptional()
  @IsString()
  memberLastName?: string;

  @IsOptional()
  @IsString()
  memberPhone?: string;

  @IsOptional()
  @IsString()
  memberCompanyName?: string;

  @IsOptional()
  @IsString()
  memberImage?: string;
}
