import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express'
import { verify } from 'argon2';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

interface IResponse {
  user: User
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 30
  REFRESH_TOKEN_NAME = 'refreshToken'

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  async login(dto: LoginDto): Promise<IResponse> {
    const user: User = await this.validateUser(dto)
    const tokens = this.issueTokens(user)

    return { user, ...tokens }
  }

  async register(dto: AuthDto): Promise<IResponse> {
    try {
      const user: User = await this.userService.create(dto)
      const tokens = this.issueTokens(user)

      return { user, ...tokens }
    } catch (error) {
      throw error
    }
  }

  async validateUser(dto: LoginDto): Promise<User> {
    const user: User = await this.userService.getByEmail(dto.email)
    if (!user) throw new NotFoundException(`Некорректный емайл или пароль`)
    if (!user.password) throw new NotFoundException(`Вы регистрировались через соцсеть`)

    const passwordEqual = await verify(user.password, dto.password)

    if (!user || !passwordEqual)
      throw new NotFoundException(`Некорректный емайл или пароль`)

    return user
  }

  async getNewTokens(refreshToken: string): Promise<IResponse> {
    const result = await this.jwt.verifyAsync(refreshToken)
    if (!result) throw new UnauthorizedException('Невалидный refresh токен')

    const user: User = await this.userService.getById(result.id)
    if (!user) throw new NotFoundException(`Пользователь ${result.id} не найден`)

    const tokens = this.issueTokens(user)

    return { user, ...tokens }
  }

  issueTokens(user: User): { accessToken: string, refreshToken: string } {
    const payload = { id: user.id, role: user.role }

    const accessToken = this.jwt.sign(payload, {
      expiresIn: '3h'
    })
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '30d'
    })

    return { accessToken, refreshToken }
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date()
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none'  // Разрешает отправлять куки на другие домены
    })
  }

  removeRefreshTokenFromResponse(res: Response): void {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none'
    })
  }

  async validateOAuthLogin(req: any): Promise<IResponse> {
    let user: User = await this.userService.getByEmail(req.user.email)

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name
        },
        include: {
          tasks: true,
          boards: true
        }
      })
    }
    const tokens = this.issueTokens(user)

    return { user, ...tokens }
  }
}
