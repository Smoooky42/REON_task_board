import { IsNotEmpty, IsEnum } from "class-validator";
import { EnumTaskStatus } from '@prisma/client';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusDto {
    @IsNotEmpty()
    @IsEnum(EnumTaskStatus, { message: 'Неверный статус задачи' })
    @ApiProperty({ example: 'DONE', description: 'Статус задачи' })
    status: EnumTaskStatus
}