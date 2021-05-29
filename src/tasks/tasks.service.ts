import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { DeleteResult } from 'typeorm';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { ErrorException } from '../utils/errorException';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  //
  async getAllTasks(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.user = :user', { user: user.id });

    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      //LIKE is caseSensitive & ILIKE is caseInsensitive
      query.andWhere(
        '(task.title ILIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );

    return await query.getMany();
  }

  //
  // getAllTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) tasks = tasks.filter((it) => it.status === status);
  //
  //   if (search)
  //     tasks = tasks.filter(
  //       (it) => it.title.includes(search) || it.description.includes(search),
  //     );
  //
  //   return tasks;
  // }
  //

  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    const found = await this.taskRepository.findOne({
      where: { id, user: user.id },
    });

    if (!found) throw new NotFoundException(`task with ${id} not fond`);

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: number,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: string): Promise<any> {
    const task = await this.taskRepository.delete(id);
    if (task.affected === 0)
      throw new ErrorException(
        `task with ${id} not fond`,
        HttpStatus.NOT_FOUND,
      );
    return {};
  }
}
