import { ApiProperty } from "@nestjs/swagger"
import { EnumRoleUser, User } from "@prisma/client"

export class UserResponse implements User {
	@ApiProperty()
	id: string

	@ApiProperty()
	createdAt: Date

	@ApiProperty()
	updatedAt: Date

	@ApiProperty()
	email: string

	@ApiProperty()
	name: string

	@ApiProperty()
	password: string | null

	@ApiProperty({ enum: EnumRoleUser })
	role: EnumRoleUser
}