"use client";

import { useModal } from "@/contexts/ModalContext";
import { api } from "@/lib/api";
import { TaskList } from "@/types/task";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface LeftSidebarProps {
  taskLists: TaskList[];
  selectedListId: string | null;
  onSelectList: (id: string) => void;
  isLoading: boolean;
}

export default function LeftSidebar({
  taskLists,
  selectedListId,
  onSelectList,
  isLoading,
}: LeftSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();

  const createList = useMutation({
    mutationFn: (name: string) => api.post("/task-lists", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      setIsCreating(false);
      setNewListName("");
      setError("");
    },
    onError: (err: unknown) => {
      if (typeof err === "object" && err && "response" in err) {
        // @ts-expect-error: dynamic error shape from axios
        setError(err.response?.data?.message || "Failed to create list");
      } else {
        setError("Failed to create list");
      }
    },
  });

  const deleteList = useMutation({
    mutationFn: (id: string) => api.delete(`/task-lists/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });

  const handleDeleteList = (list: TaskList) => {
    openModal(
      <>
        <p className="text-gray-600">
          Are you sure you want to delete the task list &ldquo;{list.name}
          &rdquo;? This will also delete all tasks in this list. This action
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => closeModal()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deleteList.mutate(list.id);
              closeModal();
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </>,
      "Delete Task List"
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Task Lists</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => {
              setNewListName(e.target.value);
              setError("");
            }}
            placeholder="New list name"
            className="w-full rounded-lg border border-gray-300 p-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newListName.trim()) {
                const exists = taskLists.some(
                  (list) =>
                    list.name.toLowerCase() === newListName.trim().toLowerCase()
                );
                if (exists) {
                  setError("A list with this name already exists.");
                  return;
                }
                createList.mutate(newListName.trim());
              }
            }}
          />
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {taskLists.map((list) => (
          <div
            key={list.id}
            className={`group mb-2 flex items-center justify-between rounded-lg p-2 hover:bg-gray-100 ${
              selectedListId === list.id ? "bg-gray-100" : ""
            }`}
          >
            <button
              onClick={() => onSelectList(list.id)}
              className="flex-1 text-left"
            >
              {list.name}
            </button>
            <button
              onClick={() => handleDeleteList(list)}
              className="ml-2 rounded-lg p-1 opacity-0 hover:bg-gray-200 group-hover:opacity-100"
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
