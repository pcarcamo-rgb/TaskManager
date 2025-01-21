import { Category } from "./category.interface";

export interface Task {
  id: number;
  name: string;
  description: string;
  category: Category;
  status: TaskStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export enum TaskStatus {
  Todo = "todo",
  InProgress = "in progress",
  Done = "done",
}
