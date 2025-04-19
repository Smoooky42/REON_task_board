import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user as User

		if (!user) {
			throw new Error('request.user отсутсвует. Проблема с расшифровкой JWT токена')
		}

		return data ? user[data] : user
	}
)
