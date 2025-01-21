#! /usr/bin/env node
import Table from "cli-table3";
import { Command } from "commander";
import { TaskService } from "./Tasks/task.service.js";
import figlet from "figlet";
import chalk from "chalk";
import wrapAnsi from "wrap-ansi";

console.log(figlet.textSync("Task Manager"));

const taskService = new TaskService();
const program = new Command();

program
  .name("Pablo Task Manager")
  .version("1.0.0")
  .description("Task Manager CLI");

program
  .command("add-category")
  .description("Add a Category")
  .argument("<categoryName>", "Name of the category")
  .action((categoryName) => {
    taskService.addCategory(categoryName);
  });

program
  .command("del-category")
  .description("Delete a Category")
  .argument("<CategoryID>", "Id of the Category")
  .action((CategoryID) => {
    taskService.deleteCategory(CategoryID);
  });

program
  .command("upd-category")
  .description("Update a Category")
  .arguments("<CategoryID> <categoryName>")
  .action((CategoryID, categoryName) => {
    taskService.updateCategory(CategoryID, categoryName);
  });

program
  .command("add-task")
  .description("Add a task")
  .argument("<taskName>", "Name of the task")
  .argument("<categoryName>", "Name of the category")
  .argument("[taskDescription...]", "Description of the task")
  .action((taskName, taskDescription, categoryName) => {
    const description = taskDescription ? taskDescription.join(" ") : "";
    taskService.addTask(taskName, description, categoryName);
  });

program
  .command("show-task")
  .description("Show detailed information of a task")
  .argument("<id>", "ID of the task to display")
  .action((id) => {
    const task = taskService.tasks.find((t) => t.id == id);

    if (!task) {
      console.log(chalk.red(`Task with ID ${id} not found.`));
      return;
    }

    const formattedDescription = wrapAnsi(task.description, 50, { hard: true })
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");

    const labels = {
      ID: "ID:",
      Name: "Name:",
      Description: "Description:",
      Category: "Category:",
      Status: "Status:",
      CreatedAt: "Created At:",
      UpdatedAt: "Updated At:",
    };

    const formatLine = (label: string, value: string) => `${label} ${value}`;

    const createdAt = task.createdAt
      ? new Date(task.createdAt).toISOString()
      : "N/A";
    const updatedAt = task.updatedAt
      ? new Date(task.updatedAt).toISOString()
      : "N/A";

    console.log(`
${chalk.blue.bold("Task Details")}
${"-".repeat(40)}
${formatLine(labels.ID, task.id.toString())}
${formatLine(labels.Name, task.name)}
${labels.Description}
${formattedDescription}
${formatLine(labels.Category, task.category.name)}
${formatLine(labels.Status, task.status.toUpperCase())}
${formatLine(labels.CreatedAt, createdAt)}
${formatLine(labels.UpdatedAt, updatedAt)}
    `);
  });

program
  .command("update-task")
  .description("Update a task")
  .arguments("<id> <description>")
  .action((id, description) => {
    taskService.updateTask(id, description);
  });

program
  .command("delete-task")
  .description("Delete a task")
  .argument("<id>")
  .action((id) => {
    taskService.deleteTask(id);
  });

program
  .command("task-list")
  .description("List all tasks")
  .option("-s, --status <status>", "Filter tasks by status")
  .option("-c, --category <category>", "Filter tasks by category")
  .action((options) => {
    let tasks = taskService.tasks;

    if (options.status) {
      tasks = tasks.filter((task) => task.status === options.status);
    }
    if (options.category) {
      tasks = tasks.filter((task) => task.category.name === options.category);
    }

    const table = new Table({
      head: [
        chalk.blue.bold("ID"),
        chalk.blue.bold("Name"),
        chalk.blue.bold("Description"),
        chalk.blue.bold("Status"),
        chalk.blue.bold("Created At"),
        chalk.blue.bold("Updated At"),
        chalk.blue.bold("Category"),
      ],
      colWidths: [5, 20, 40, 10, 25, 25, 20],
    });

    tasks.forEach((task) => {
      table.push([
        chalk.blue(task.id),
        task.name,
        task.description,
        chalk.blue.bold(task.status.toUpperCase()),
        chalk.blue(task.createdAt),
        chalk.blue(task.updatedAt || "N/A"),
        chalk.blue.bold(task.category.name),
      ]);
    });

    console.log(table.toString());
  });

program.parse(process.argv);
