import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class LoginDto {
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

