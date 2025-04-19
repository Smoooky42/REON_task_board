import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Название задачи', description: 'Название задачи' })
    title: string

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'описание задачи', description: 'Описание задачи' })
    description: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '2025-04-20', description: 'дата дедлайна' })
    deadline: string
}
