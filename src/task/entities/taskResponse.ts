import { ApiProperty } from "@nestjs/swagger";
import { EnumTaskStatus, Task } from "@prisma/client";

export class TaskResponse implements Task {
    @ApiProperty()
    id: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

    @ApiProperty()
    title: string

    @ApiProperty()
    description: string | null

    @ApiProperty()
    deadline: Date

    @ApiProperty({ enum: EnumTaskStatus })
    status: EnumTaskStatus

    @ApiProperty()
    boardId: string
}

export class TaskAddBoard {
    @ApiProperty({ example: 'cm9n3h2iv0000tijc1shcemx8' })
    boadId: string
}

export class TaskAddUser {
    @ApiProperty({ example: 'cm9n3h2iv0000tijc1shcemx8' })
    userId: string
}