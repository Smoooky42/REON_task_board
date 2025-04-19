import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private configService: ConfigService) {
		const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
		if (!clientID) {
			throw new Error('GOOGLE_CLIENT_ID отсутствует в конфигурации');
		}

		const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
		if (!clientSecret) {
			throw new Error('GOOGLE_CLIENT_SECRET отсутствует в конфигурации');
		}

		super({
			clientID: clientID,
			clientSecret: clientSecret,
			callbackURL:
				configService.get<string>('SERVER_URL') +
				'/auth/google/callback',
			scope: ['profile', 'email']
		})
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	) {
		const { displayName, emails } = profile
		if (!emails || emails.length === 0) {
			return done(new Error('Email не найден в профиле Google'))
		}
		if (!displayName) {
			return done(new Error('Имя не найдено в профиле Google'))
		}

		const user = {
			email: emails[0].value,
			name: displayName,
		}

		done(null, user) //user передается в controller внутри req
	}
}
