import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/user/decorators/user.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/role.decorator';
import { ApiBody, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TaskAddBoard, TaskAddUser, TaskResponse } from './entities/taskResponse';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: TaskResponse, description: 'Создание задачи' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.taskService.create(userId, createTaskDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: [TaskResponse], description: 'Получить все задачи' })
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: TaskResponse, description: 'Получить одну задачу' })
  @ApiParam({ name: 'id', description: 'id задачи', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  findOne(@Param('id') TaskId: string) {
    return this.taskService.findOne(TaskId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: TaskResponse, description: 'Обновить задачу' })
  @ApiParam({ name: 'id', description: 'id задачи', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: CreateTaskDto, description: 'Данные для обновления задачи', required: true })
  update(@Param('id') TaskId: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(TaskId, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: TaskResponse, description: 'Удалить задачу' })
  @ApiParam({ name: 'id', description: 'id задачи', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  remove(@Param('id') TaskId: string) {
    return this.taskService.remove(TaskId);
  }

  @Post('status/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: TaskResponse, description: 'Обновить статус задачи' })
  @ApiParam({ name: 'id', description: 'id задачи', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: UpdateStatusDto, description: 'Данные для обновления статуса задачи', required: true })
  updateStatus(
    @Param('id') TaskId: string,
    @Body('status') dto: UpdateStatusDto,
  ) {
    return this.taskService.updateStatus(TaskId, dto.status);
  }

  @Post('board/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponse({ type: TaskResponse, description: 'Прикрепить задачу к другой доске' })
  @ApiParam({ name: 'id', description: 'id задачи', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: TaskAddBoard, description: 'id доски', required: true })
  updateBoard(
    @Param('id') TaskId: string,
    @Body('boardId') boardId: string,
  ) {
    return this.taskService.updateBoard(TaskId, boardId);
  }

  @Post('user/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: TaskResponse, description: 'Добавить ответственного' })
  @ApiParam({ name: 'id', description: 'id задачи', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: TaskAddUser, description: 'id ответственного', required: true })
  updateResponsible(
    @Param('id') TaskId: string,
    @Body('userId') userId: string,
  ) {
    return this.taskService.updateResponsible(TaskId, userId);
  }
}
