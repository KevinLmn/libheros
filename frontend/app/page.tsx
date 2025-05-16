"use client";

import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Task, TaskList } from "@/types/task";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Components
import LeftSidebar from "@/components/layout/LeftSidebar";
import Navbar from "@/components/layout/Navbar";
import RightSidebar from "@/components/layout/RightSidebar";
import NoListSelected from "@/components/tasks/NoListSelected";
import TaskListContent from "@/components/tasks/TaskListContent";

export default function Home() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const rightSidebarRef = useRef<HTMLDivElement | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  // Close right sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectedTask &&
        rightSidebarRef.current &&
        !rightSidebarRef.current.contains(event.target as Node)
      ) {
        setSelectedTask(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedTask]);

  // Fetch task lists
  const { data: taskLists, isLoading: isLoadingLists } = useQuery<TaskList[]>({
    queryKey: ["taskLists"],
    queryFn: () => api.get("/task-lists").then((res) => res.data),
    enabled: !!user,
  });

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      <div className="flex flex-1">
        {/* Left Sidebar Toggle */}
        <button
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className={`fixed top-20 z-50 rounded-r-lg bg-white p-2 shadow-md hover:bg-gray-100 transition-all duration-300 ${
            isLeftSidebarOpen ? "left-64" : "left-0"
          }`}
        >
          {isLeftSidebarOpen ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
            <Bars3Icon className="h-5 w-5" />
          )}
        </button>

        {/* Left Sidebar */}
        <div
          className={`fixed left-0 top-16 z-40 h-[calc(100%-4rem)] w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
            isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LeftSidebar
            taskLists={taskLists || []}
            selectedListId={selectedListId}
            onSelectList={setSelectedListId}
            isLoading={isLoadingLists}
          />
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isLeftSidebarOpen ? "ml-64" : "ml-0"
          } ${selectedTask ? "mr-80" : "mr-0"}`}
        >
          <div className="h-full p-6">
            {selectedListId ? (
              <TaskListContent
                taskListId={selectedListId}
                onSelectTask={setSelectedTask}
              />
            ) : (
              <NoListSelected />
            )}
          </div>
        </main>

        {/* Right Sidebar (with click outside detection) */}
        {selectedTask && (
          <div
            ref={rightSidebarRef}
            className="fixed right-0 top-16 z-40 h-[calc(100%-4rem)] w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out"
          >
            <RightSidebar
              listId={selectedListId}
              selectedTask={selectedTask}
              onTaskDeleted={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
