import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from '@/prisma.service';
import { Board, User } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createBoardDto: CreateBoardDto, userId: string): Promise<Board> {
    const board: Board = await this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        description: createBoardDto.description,
        author: {
          connect: { id: userId },
        },
      },
      include: {
        users: true,
        tasks: true,
      },
    });

    return board;
  }

  async findAll(): Promise<Board[]> {
    const boards: Board[] = await this.prisma.board.findMany({
      include: {
        users: true,
        tasks: true,
      },
    });

    return boards;
  }

  async findOne(id: string): Promise<Board> {
    const board: Board | null = await this.prisma.board.findUnique({
      where: { id },
      include: {
        users: true,
        tasks: true,
      },
    });
    if (!board) {
      throw new NotFoundException(`Доска с id ${id} не найдена`);
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    try {
      const newBoard: Board = await this.prisma.board.update({
        where: { id },
        data: {
          title: updateBoardDto.title,
          description: updateBoardDto.description,
        },
        include: {
          users: true,
          tasks: true,
        },
      });
      if (!newBoard) {
        throw new BadRequestException(`Ошибка обновления доски с id ${id}`);
      }
      return newBoard;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string): Promise<Board> {
    try {
      const board: Board = await this.prisma.board.delete({ where: { id } });
      if (!board) {
        throw new BadRequestException(`Ошибка удаления доски с id ${id}`);
      }
      return board;
    } catch (error) {
      throw error;
    }
  }

  async addUserToBoard(boardId: string, userId: string): Promise<Board> {
    const board: Board | null = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException(`Доска с id ${boardId} не найдена`);
    }

    const user: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${userId} не найден`);
    }

    const updatedBoard: Board = await this.prisma.board.update({
      where: { id: boardId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: {
        users: true,
        tasks: true,
      },
    });

    return updatedBoard;
  }

  async removeUserFromBoard(boardId: string, userId: string): Promise<Board> {
    const board: Board | null = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new NotFoundException(`Доска с id ${boardId} не найдена`);
    }

    const user: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${userId} не найден`);
    }

    const updatedBoard: Board = await this.prisma.board.update({
      where: { id: boardId },
      data: {
        users: {
          disconnect: { id: userId },
        },
      },
      include: {
        users: true,
        tasks: true,
      },
    });

    return updatedBoard;
  }
}
