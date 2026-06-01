import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthResponse } from '../../libs/dto/member/member';
import { LoginInput, RegisterInput } from '../../libs/dto/member/member.input';
import type { AuthenticatedRequest } from '../../libs/types/authenticated-request';
import { AuthService } from './auth.service';
import { MemberAuthGuard } from './guards/member-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Tight limit on credential endpoints to blunt brute-force / credential stuffing.
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('register')
  register(@Body() input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('login')
  @HttpCode(200)
  login(@Body() input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(MemberAuthGuard)
  async logout(@Req() req: AuthenticatedRequest) {
    await this.authService.logout(req.session!.token);
    return { success: true };
  }
}
