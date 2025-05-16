import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskListsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.taskList.findMany({
      where: { userId },
      include: { tasks: true },
    });
  }

  async findOne(id: string, userId: string) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id, userId },
      include: { tasks: true },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    return taskList;
  }

  async create(name: string, userId: string) {
    // Check for existing list with the same name (case-insensitive) for this user
    const existing = await this.prisma.taskList.findFirst({
      where: {
        userId,
        name: { equals: name, mode: 'insensitive' },
      },
    });
    if (existing) {
      throw new BadRequestException(
        'A task list with this name already exists.',
      );
    }
    return this.prisma.taskList.create({
      data: {
        name,
        userId,
      },
      include: { tasks: true },
    });
  }

  async update(id: string, name: string, userId: string) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    return this.prisma.taskList.update({
      where: { id },
      data: { name },
      include: { tasks: true },
    });
  }

  async remove(id: string, userId: string) {
    const taskList = await this.prisma.taskList.findFirst({
      where: { id, userId },
    });

    if (!taskList) {
      throw new NotFoundException('Task list not found');
    }

    return this.prisma.taskList.delete({
      where: { id },
    });
  }
}
