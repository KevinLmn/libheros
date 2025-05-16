"use client";

import { useModal } from "@/contexts/ModalContext";
import { tasks } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RightSidebarProps {
  selectedTask: Task | null;
  onTaskDeleted: () => void;
  listId: string | null;
}

export default function RightSidebar({
  selectedTask,
  onTaskDeleted,
  listId,
}: RightSidebarProps) {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      if (!selectedTask) return;
      console.log("Deleting task", { listId, taskId });

      if (listId) {
        const response = await tasks.delete(listId, taskId);
        return response.data;
      }
      return null;
    },
    onSuccess: () => {
      if (listId) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", listId],
        });
      }
      closeModal();
      onTaskDeleted();
    },
  });

  if (!selectedTask) return null;

  const handleDeleteTask = () => {
    openModal(
      <>
        <p className="text-gray-600">
          Are you sure you want to delete the task &ldquo;{selectedTask.title}
          &rdquo;? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteTaskMutation.mutate(selectedTask.id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </>,
      "Delete Task"
    );
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white p-6 flex flex-col h-full">
      {/* Task Details */}
      <div className="space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedTask.title}
          </h2>
          <button
            onClick={handleDeleteTask}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-sm text-gray-900">
              {selectedTask.description || "No description"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
            <p className="mt-1 text-sm text-gray-900">
              {selectedTask.dueDate &&
              !isNaN(new Date(selectedTask.dueDate).getTime())
                ? formatDate(selectedTask.dueDate)
                : "No due date"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(selectedTask.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-sm text-gray-900">
              {selectedTask.completed ? "Completed" : "Active"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
