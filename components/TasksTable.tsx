"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  AlarmClock,
  Blocks,
  CalendarDays,
  ChartSpline,
  ChevronDown,
  MoreHorizontal,
  SquareActivity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/providers/axios";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { Spinner } from "./ui/spinner";
import z from "zod";
import { taskSchema } from "@/schemas";
import { toast } from "sonner";
import { queryClient } from "@/providers/QueryClientProvider";

export function TaskTable() {
  const taskDeleteMutation = useMutation({
    mutationFn: async (taskID: string) => {
      const res = await axiosInstance.delete(`/tasks/${taskID}`);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_tasks"] });
      toast.success("Task is deleted successfully");
    },
    onError: () => {
      toast.error("Error in deleting the task");
    },
  });

  const columns: ColumnDef<z.infer<typeof taskSchema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorFn: (row) => row?.name,
      header: () => (
        <div className="flex justify-start items-center gap-1">
          <Blocks size={`15`} color="#f87941" />
          <p className="text-[#f87941]">Name</p>
        </div>
      ),
      cell: ({ getValue }) => {
        return <div className="capitalize">{getValue<string>()}</div>;
      },
    },
    {
      id: "priority",
      accessorFn: (row) => row?.priority,
      accessorKey: "priority",
      enableColumnFilter: true,
      filterFn: "equalsString",
      header: () => (
        <div className="flex justify-start items-center gap-1">
          <SquareActivity size={`15`} color="#f87941" />
          <p className="text-[#f87941]">Priority</p>
        </div>
      ),
      cell: ({ getValue }) => (
        <Badge
          variant="outline"
          className="capitalize text-muted-foreground px-1.5"
        >
          <IconCircleCheckFilled className="fill-green-500" />
          {getValue<string>()}
        </Badge>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => row?.status,
      header: () => (
        <div className="flex justify-start items-center gap-1">
          <ChartSpline size={`15`} color="#f87941" />
          <p className="text-[#f87941]">Status</p>
        </div>
      ),
      cell: ({ getValue }) => (
        <Badge variant="outline" className="capitalize">
          {getValue<string>()}
        </Badge>
      ),
    },
    {
      id: "time",
      accessorFn: (row) => row?.time,
      header: () => (
        <div className="flex justify-start items-center gap-1">
          <AlarmClock size={`15`} color="#f87941" />
          <p className="text-[#f87941]">Time</p>
        </div>
      ),
      cell: ({ getValue }) => {
        return <div className="capitalize">{getValue<number>()}</div>;
      },
    },
    {
      id: "createdAt",
      accessorFn: (row) => row?.createdAt,
      header: () => (
        <div className="flex justify-start items-center gap-1">
          <CalendarDays size={`15`} color="#f87941" />
          <p className="text-[#f87941]">Created</p>
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="capitalize">
          {new Date(getValue<string>()).toLocaleDateString()}
        </div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-4 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => taskDeleteMutation.mutate(task?.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "priority",
      desc: true,
    },
  ]);

  const [isDeleteButtonOpen, setIsDeleteButtonOpen] =
    React.useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  React.useEffect(() => {
    const hasSelection = Object.keys(rowSelection).length > 0;
    setIsDeleteButtonOpen(hasSelection);
  }, [rowSelection]);

  const tasksQuery = useQuery({
    queryKey: ["user_tasks"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/tasks/`);

      return res.data;
    },
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const table = useReactTable({
    data: tasksQuery.data?.tasks ? tasksQuery.data?.tasks : [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter Names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="w-auto flex justify-center items-center gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {tasksQuery.data?.tasks && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() =>
                    router.push(`/dashboard/${row.original?.id}/update`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="w-full h-24 text-center relative"
                >
                  <Spinner className="absolute top-1/2 left-1/2" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {tasksQuery.data?.posts &&
            table.getFilteredSelectedRowModel()?.rows?.length}{" "}
          of {tasksQuery.data?.posts && table.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
