import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserResponse } from './entities/userResponse';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: [UserResponse], description: 'Получить всех пользователей' })
  async getAll() {
    return await this.userService.getAll()
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @ApiCreatedResponse({ type: UserResponse, description: 'Получить одного пользователя' })
  @ApiParam({ name: 'id', description: 'id пользователя', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @UseGuards(RolesGuard)
  async getOne(@Param('id') id: string) {
    return await this.userService.getById(id)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: UserResponse, description: 'Удалить пользователя' })
  @ApiParam({ name: 'id', description: 'id пользователя', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
