import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {
		const secretKey = configService.get<string>('JWT_SECRET_KEY');
		if (!secretKey) {
			throw new Error('JWT_SECRET_KEY отсутствует в конфигурации');
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: secretKey
		})
	}

	async validate(userData: { id: string }) {
		if (!userData || !userData.id) {
			throw new UnauthorizedException('JWT-токен отсутствует или недействителен');
		}

		return await this.userService.getById(userData.id)
	}
}
