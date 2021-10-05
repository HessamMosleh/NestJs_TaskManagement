import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UserEntity } from '../auth/user.entity';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = new TaskEntity();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;
    return task;
  }

  async getTasks(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

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
}
