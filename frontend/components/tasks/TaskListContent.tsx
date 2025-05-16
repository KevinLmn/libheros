"use client";

import { tasks } from "@/lib/api";
import { Task } from "@/types/task";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface TaskListContentProps {
  taskListId: string;
  onSelectTask: (task: Task) => void;
}

export default function TaskListContent({
  taskListId,
  onSelectTask,
}: TaskListContentProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasksList = [] } = useQuery<Task[]>({
    queryKey: ["tasks", taskListId],
    queryFn: async () => {
      const response = await tasks.getAll(taskListId);
      return response.data;
    },
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const isDueDateValid =
    newTaskDueDate && new Date(newTaskDueDate) >= new Date(todayStr);

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      const response = await tasks.create(taskListId, {
        title: newTaskTitle,
        description: newTaskDescription || "No description",
        dueDate: newTaskDueDate,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskListId] });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setIsCreatingTask(false);
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const response = await tasks.update(taskListId, task.id, {
        completed: !task.completed,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskListId] });
    },
  });

  const activeTasks = tasksList.filter((task: Task) => !task.completed);
  const completedTasks = tasksList.filter((task: Task) => task.completed);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6 pr-6">
        {/* Task Creation Form */}
        {isCreatingTask ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Task description (optional)"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <input
              type="date"
              value={newTaskDueDate}
              min={todayStr}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsCreatingTask(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createTaskMutation.mutate()}
                disabled={!newTaskTitle || !newTaskDueDate || !isDueDateValid}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreatingTask(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Task
          </button>
        )}

        {/* Active Tasks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Active Tasks</h3>
            <button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {showCompletedTasks ? "Hide" : "Show"} Completed
            </button>
          </div>
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 cursor-pointer hover:bg-gray-50`}
              onClick={() => onSelectTask(task)}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskMutation.mutate(task);
                  }}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    task.completed
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {task.completed && (
                    <CheckIcon className="h-3 w-3 text-white" />
                  )}
                </button>
                <span
                  className={`text-sm ${
                    task.completed ? "text-gray-500 line-through" : ""
                  }`}
                >
                  {task.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Tasks */}
        {showCompletedTasks && completedTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
              Completed Tasks
            </h3>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-pointer hover:bg-gray-100`}
                onClick={() => onSelectTask(task)}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskMutation.mutate(task);
                    }}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      task.completed
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {task.completed && (
                      <CheckIcon className="h-3 w-3 text-white" />
                    )}
                  </button>
                  <span
                    className={`text-sm ${
                      task.completed ? "text-gray-500 line-through" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
