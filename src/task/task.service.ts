import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '@/prisma.service';
import { EnumTaskStatus, Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const date = new Date(createTaskDto.deadline);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Неверный формат даты');
    }

    const task: Task = await this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        deadline: date,
        users: {
          connect: { id: userId },
        }
      },
      include: {
        board: true,
        users: true,
      },
    });
    return task;
  }

  async findAll(): Promise<Task[]> {
    const tasks: Task[] = await this.prismaService.task.findMany({
      include: {
        board: true,
        users: true,
      },
    });
    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    const task: Task | null = await this.prismaService.task.findUnique({
      where: { id },
      include: {
        board: true,
        users: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Задача с id ${id} не найдена`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const date = updateTaskDto.deadline ? new Date(updateTaskDto.deadline) : null;
      if (updateTaskDto.deadline && date && isNaN(date.getTime())) {
        throw new BadRequestException('Неверный формат даты');
      }

      const task: Task = await this.prismaService.task.update({
        where: { id },
        data: {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          deadline: date ?? undefined,
        },
        include: {
          board: true,
          users: true,
        },
      });
      if (!task) {
        throw new BadRequestException(`Ошибка обновления задачи с id ${id}`);
      }
      return task;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Task> {
    try {
      const task: Task = await this.prismaService.task.delete({
        where: { id },
        include: {
          board: true,
          users: true,
        },
      });
      if (!task) {
        throw new BadRequestException(`Ошибка удаления задачи с id ${id}`);
      }
      return task;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: EnumTaskStatus): Promise<Task> {
    try {
      const task: Task = await this.prismaService.task.update({
        where: { id },
        data: { status },
        include: {
          board: true,
          users: true,
        },
      });
      if (!task) {
        throw new BadRequestException(`Ошибка изменения статуса задачи с id ${id}`);
      }
      return task;
    } catch (error) {
      throw error;
    }
  }

  async updateBoard(id: string, boardId: string): Promise<Task> {
    try {
      const task: Task = await this.prismaService.task.update({
        where: { id },
        data: { boardId },
        include: {
          board: true,
          users: true,
        },
      });
      if (!task) {
        throw new BadRequestException(`Ошибка изменения доски задачи с id ${id}`);
      }
      return task;
    }
    catch (error) {
      throw error;
    }
  }

  async updateResponsible(id: string, userId: string): Promise<Task> {
    try {
      const task: Task = await this.prismaService.task.update({
        where: { id },
        data: {
          users: {
            connect: { id: userId },
          },
        },
        include: {
          board: true,
          users: true,
        },
      });
      if (!task) {
        throw new BadRequestException(`Ошибка изменения ответственного задачи с id ${id}`);
      }
      return task;
    } catch (error) {
      throw error;
    }
  }
}
