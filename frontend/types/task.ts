export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  listId: string;
}

export interface TaskList {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface CreateTaskListInput {
  name: string;
}
