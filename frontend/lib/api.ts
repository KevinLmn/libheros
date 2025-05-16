import { LoginCredentials, RegisterCredentials } from "@/types/auth";
import {
  CreateTaskInput,
  CreateTaskListInput,
  Task,
  TaskList,
  UpdateTaskInput,
} from "@/types/task";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4014";

console.log(baseURL);
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials: LoginCredentials) =>
    api.post("/auth/login", credentials),
  register: (credentials: RegisterCredentials) =>
    api.post("/auth/register", credentials),
};

export const taskLists = {
  getAll: () => api.get<TaskList[]>("/task-lists"),
  getById: (id: string) => api.get<TaskList>(`/task-lists/${id}`),
  create: (data: CreateTaskListInput) =>
    api.post<TaskList>("/task-lists", data),
  update: (id: string, data: Partial<CreateTaskListInput>) =>
    api.patch<TaskList>(`/task-lists/${id}`, data),
  delete: (id: string) => api.delete(`/task-lists/${id}`),
};

export const tasks = {
  getAll: (taskListId: string) =>
    api.get<Task[]>(`/task-lists/${taskListId}/tasks`),
  getById: (taskListId: string, taskId: string) =>
    api.get<Task>(`/task-lists/${taskListId}/tasks/${taskId}`),
  create: (taskListId: string, data: CreateTaskInput) =>
    api.post<Task>(`/task-lists/${taskListId}/tasks`, data),
  update: (taskListId: string, taskId: string, data: UpdateTaskInput) =>
    api.patch<Task>(`/task-lists/${taskListId}/tasks/${taskId}`, data),
  delete: (taskListId: string, taskId: string) =>
    api.delete(`/task-lists/${taskListId}/tasks/${taskId}`),
};
