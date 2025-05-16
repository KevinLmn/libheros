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
import { TasksService } from './tasks.service';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('task-lists/:taskListId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Param('taskListId') taskListId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.findAll(taskListId, req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('taskListId') taskListId: string,
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.findOne(taskListId, id, req.user.id);
  }

  @Post()
  create(
    @Param('taskListId') taskListId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('dueDate') dueDate: string | undefined,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.create(
      taskListId,
      title,
      description,
      req.user.id,
      dueDate,
    );
  }

  @Patch(':id')
  update(
    @Param('taskListId') taskListId: string,
    @Param('id') id: string,
    @Body() data: { title?: string; description?: string; completed?: boolean },
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(taskListId, id, data, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('taskListId') taskListId: string,
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.remove(taskListId, id, req.user.id);
  }
}
