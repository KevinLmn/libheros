import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(taskListId: string, userId: string) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id: taskListId, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    return this.prisma.task.findMany({
      where: { taskListId },
    });
  }

  async findOne(taskListId: string, taskId: string, userId: string) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id: taskListId, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, taskListId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(
    taskListId: string,
    title: string,
    description: string,
    userId: string,
    dueDate?: string,
  ) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id: taskListId, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    return this.prisma.task.create({
      data: {
        title,
        description,
        taskListId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
  }

  async update(
    taskListId: string,
    taskId: string,
    data: { title?: string; description?: string; completed?: boolean },
    userId: string,
  ) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id: taskListId, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, taskListId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async remove(taskListId: string, taskId: string, userId: string) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id: taskListId, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, taskListId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
