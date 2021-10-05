import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';

const mockUser = { username: 'testUser' };
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});
describe('TaskService', () => {
  let taskService, taskRepository;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = moduleRef.get<TasksService>(TasksService);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
  });

  describe('GetTasks', () => {
    it('get all tasks from repository', async () => {
      const filter: GetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search',
      };
      await taskService.getAllTasks(filter, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });
});
