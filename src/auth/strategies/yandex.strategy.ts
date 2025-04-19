import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-yandex'

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
	constructor(private configService: ConfigService) {
		const clientID = configService.get<string>('YANDEX_CLIENT_ID');
		if (!clientID) {
			throw new Error('YANDEX_CLIENT_ID отсутствует в конфигурации');
		}

		const clientSecret = configService.get<string>('YANDEX_CLIENT_SECRET');
		if (!clientSecret) {
			throw new Error('YANDEX_CLIENT_SECRET отсутствует в конфигурации');
		}

		super({
			clientID: clientID,
			clientSecret: clientSecret,
			callbackURL:
				configService.get<string>('SERVER_URL') +
				'/auth/yandex/callback'
		})
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: any
	) {
		const { username, emails } = profile
		if (!emails || emails.length === 0) {
			return done(new Error('Email не найден в профиле Яндекс'))
		}
		if (!username) {
			return done(new Error('Имя не найдено в профиле Яндекс'))
		}

		const user = {
			email: emails[0].value,
			name: username,
		}

		done(null, user)
	}
}
