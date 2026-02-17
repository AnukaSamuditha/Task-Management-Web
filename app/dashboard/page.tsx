"use client";
import { TaskTable } from "@/components/TasksTable";

export default function MyTaskPage() {
  return (
    <div className="w-full h-full px-5 py-0">
      <div className="w-full h-auto flex justify-between items-center">
        <div className="w-auto">
          <h1 className="text-lg font-medium text-black">My Tasks</h1>
          <p className="text-xs text-muted-foreground">
            View and manage all the tasks you’ve created. Keep track of their
            progress and update them as needed.
          </p>
        </div>
      </div>
      <TaskTable />
    </div>
  );
}
