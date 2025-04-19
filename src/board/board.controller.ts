import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@/user/decorators/user.decorator';
import { Roles } from '@/auth/decorators/role.decorator';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ApiBody, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { BoardBodyRequest, BoardResponse } from './entities/boardRespons';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: BoardResponse, description: 'Создание доски' })
  create(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser('id') userId: string, // Получаем id пользователя из req.user
  ) {
    return this.boardService.create(createBoardDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: [BoardResponse], description: 'Получить все доски' })
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: BoardResponse, description: 'Поиск одной доски' })
  @ApiParam({ name: 'id', description: 'id доски', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  findOne(@Param('id') boardId: string) {
    return this.boardService.findOne(boardId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: BoardResponse, description: 'Обновить доску' })
  @ApiParam({ name: 'id', description: 'id доски', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: CreateBoardDto, description: 'Данные для обновления доски', required: true })
  update(@Param('id') boardId: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(boardId, updateBoardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: BoardResponse, description: 'Удалить доску' })
  @ApiParam({ name: 'id', description: 'id доски', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  remove(@Param('id') boardId: string) {
    return this.boardService.remove(boardId);
  }

  @Post('user/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: BoardResponse, description: 'Добавить пользователя на доску' })
  @ApiParam({ name: 'id', description: 'id доски', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: BoardBodyRequest, description: 'id пользователя', required: true })
  addUserToBoard(
    @Param('id') boardId: string,
    @Body('userId') userId: string,
  ) {
    return this.boardService.addUserToBoard(boardId, userId);
  }

  @Delete('user/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: BoardResponse, description: 'Удалить пользователя с доски' })
  @ApiParam({ name: 'id', description: 'id доски', required: true, example: 'cm9n3h2iv0000tijc1shcemx8' })
  @ApiBody({ type: BoardBodyRequest, description: 'id пользователя', required: true })
  removeUserFromBoard(
    @Param('id') boardId: string,
    @Body('userId') userId: string,
  ) {
    return this.boardService.removeUserFromBoard(boardId, userId);
  }
}
