import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskListsService } from './task-lists.service';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('task-lists')
@UseGuards(JwtAuthGuard)
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) {}

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.taskListsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.taskListsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body('name') name: string, @Request() req: RequestWithUser) {
    return this.taskListsService.create(name, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Request() req: RequestWithUser,
  ) {
    return this.taskListsService.update(id, name, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.taskListsService.remove(id, req.user.id);
  }
}
