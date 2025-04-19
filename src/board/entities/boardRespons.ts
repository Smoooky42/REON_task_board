import { ApiProperty } from "@nestjs/swagger";
import { Board, User } from "@prisma/client";

export class BoardResponse implements Board {
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
    dateOfCreation: Date

    @ApiProperty()
    authorId: string
}

export class BoardBodyRequest {
    @ApiProperty()
    userId: string
}
