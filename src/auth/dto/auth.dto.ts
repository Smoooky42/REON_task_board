import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength, } from 'class-validator'

export class AuthDto {

	@IsString()
	@MinLength(2, { message: 'Имя должно быть больше 2 символов' })
	@IsString({ message: 'Имя должно быть строкой' })
	@ApiProperty({ example: 'Алексей', description: 'Имя' })
	name: string

	@IsEmail({}, { message: 'Некорректный email' })
	@IsString({ message: 'Email должен быть строкой' })
	@IsNotEmpty({ message: 'Email не должен быть пустым' })
	@ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
	email: string

	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(6, { message: 'Пароль должен быть больше 6 символов' })
	@ApiProperty({ example: '12345', description: 'пароль' })
	password: string
}
