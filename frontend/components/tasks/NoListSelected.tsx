"use client";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function NoListSelected() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <ClipboardDocumentListIcon className="mb-4 h-16 w-16 text-gray-400" />
      <h2 className="mb-2 text-xl font-semibold text-gray-700">
        No Task List Selected
      </h2>
      <p className="text-gray-500">
        Select a task list from the sidebar or create a new one to get started.
      </p>
    </div>
  );
}
