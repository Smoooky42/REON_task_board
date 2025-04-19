import { Controller, Get, Post, Body, HttpCode, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponse } from './entities/authResponse';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiCreatedResponse({ type: AuthResponse, description: 'Авторизация' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.login(dto)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Post('register')
  @ApiCreatedResponse({ type: AuthResponse, description: 'Регистрация' })
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } =
      await this.authService.register(dto)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Get('refresh')
  @ApiCreatedResponse({ type: AuthResponse, description: 'Обновление токенов' })
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME]

    if (!refreshTokenFromCookies) {
      throw new UnauthorizedException('Refresh токен отсутствует. Авторизуйтесь')
    }

    const { refreshToken, ...response } =
      await this.authService.getNewTokens(refreshTokenFromCookies)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @Get('logout')
  @ApiCreatedResponse({ type: Boolean, description: 'Выйти с аккаунта' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res)
    return true
  }

  @Get('google')
  @ApiCreatedResponse({ type: AuthResponse, description: 'Регистрация google' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return res.redirect(`${process.env['CLIENT_URL']}`)
  }

  @Get('yandex')
  @ApiCreatedResponse({ type: AuthResponse, description: 'Регистрация yandex' })
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth(@Req() _req) { }

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return res.redirect(`${process.env['CLIENT_URL']}`)
  }
}
