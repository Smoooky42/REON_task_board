import { UserResponse } from "@/user/entities/userResponse"
import { ApiProperty } from "@nestjs/swagger"
import { User } from "@prisma/client"

export class AuthResponse {
    @ApiProperty({ type: UserResponse })
    user: User
    @ApiProperty()
    accessToken: string
}