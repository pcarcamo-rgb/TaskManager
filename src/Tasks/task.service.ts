import fs from "fs";
import { Task, TaskStatus } from "./interfaces/task.interface.js";
import { Category } from "./interfaces/category.interface.js";

export class TaskService {
  tasks: Task[];
  categories: Category[];

  constructor() {
    if (fs.existsSync("C:/dvlp/TaskManager/db/category.json")) {
      const categories = fs.readFileSync(
        "C:/dvlp/TaskManager/db/category.json",
        "utf-8"
      );
      this.categories = JSON.parse(categories);
    } else {
      this.categories = [];
      fs.writeFileSync(
        "C:/dvlp/TaskManager/db/category.json",
        JSON.stringify(this.categories)
      );
    }
    if (fs.existsSync("C:/dvlp/TaskManager/db/tasks.json")) {
      const tasks = fs.readFileSync(
        "C:/dvlp/TaskManager/db/tasks.json",
        "utf-8"
      );
      this.tasks = JSON.parse(tasks);
    } else {
      this.tasks = [];
      fs.writeFileSync(
        "C:/dvlp/TaskManager/db/tasks.json",
        JSON.stringify(this.tasks)
      );
    }
  }

  addTask(name: string, description: string, category: string) {
    const findCategory = this.categories.find((cat) => (cat.name = category));
    if (!findCategory) {
      console.error(`Category ${category} not found.`);
      return;
    }
    this.tasks.push({
      id: this.tasks.length + 1,
      name,
      description,
      category: findCategory,
      status: TaskStatus.Todo,
      createdAt: new Date(),
    });
    this.updateTasksFile();
  }

  updateTask(id: number, description: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      description: description,
      updatedAt: new Date(),
    };
    this.updateTasksFile();
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.updateTasksFile();
  }

  addCategory(category: string) {
    this.categories.push({
      id: this.categories.length + 1,
      name: category,
    });
  }

  updateCategory(id: number, category: string) {
    const catIndex = this.categories.findIndex((cat) => cat.id === id);
    this.categories[catIndex] = {
      ...this.categories[catIndex],
      name: category,
    };
    this.updateCategoriesFile();
  }

  deleteCategory(id: number) {
    this.categories.filter((cat) => cat.id !== id);
    this.updateCategoriesFile();
  }

  private updateTasksFile() {
    const tasks = JSON.stringify(this.tasks);
    fs.writeFileSync("C:/dvlp/TaskManager/db/tasks.json", tasks);
  }

  private updateCategoriesFile() {
    const categories = JSON.stringify(this.categories);
    fs.writeFileSync("C:/dvlp/TaskManager/db/category.json", categories);
  }
}
