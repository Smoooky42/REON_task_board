import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator'

export class CreateBoardDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Название доски', description: 'Название доски' })
    title: string

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Описание доски', description: 'описание доски' })
    description: string

}
