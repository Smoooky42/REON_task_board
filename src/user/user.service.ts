import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { hash } from 'argon2';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: AuthDto): Promise<User> {
    const user: User = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
      include: {
        tasks: true,
        boards: true
      }
    })
    return user
  }

  async getById(id: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: true,
        boards: true
      }
    })
    if (!user) throw new NotFoundException(`Пользователь с id ${id} не найден`)
    return user
  }

  async getByEmail(email: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tasks: true,
        boards: true
      }
    })
    if (!user) throw new NotFoundException(`Пользователь с email ${email} не найден`)
    return user
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this.prisma.user.findMany({
      include: {
        tasks: true,
        boards: true
      }
    })
    return users
  }

  async delete(id: string): Promise<User> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id }
    })
    if (!user) throw new NotFoundException(`Пользователь с id ${id} не найден`)

    await this.prisma.user.delete({
      where: { id },
    })
    return user
  }
}
