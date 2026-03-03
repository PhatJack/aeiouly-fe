'use client';

import * as React from 'react';

import { DataTablePagination } from '@/components/app/table/DataTablePagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

export type SimpleOption = { value: string; label: string };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  categoryOptions?: SimpleOption[];
  categoryFilter?: string;
  onCategoryChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPaginationChange,
  searchTerm = '',
  onSearchChange,
  categoryOptions,
  categoryFilter = 'all',
  onCategoryChange,
  searchPlaceholder = 'Tìm kiếm code, tên...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? Math.ceil(data.length / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: !!onPaginationChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (onPaginationChange) {
        const newPagination =
          typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
        onPaginationChange(newPagination);
      }
    },
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => onSearchChange?.(event.target.value)}
            className="max-w-sm"
          />

          {categoryOptions && categoryOptions.length > 0 ? (
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Nhóm danh hiệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhóm</SelectItem>
                <SelectItem value="none">Không nhóm</SelectItem>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          {table.getColumn('is_active') ? (
            <Select
              value={(table.getColumn('is_active')?.getFilterValue() as string) ?? 'all'}
              onValueChange={(value) =>
                table.getColumn('is_active')?.setFilterValue(value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Hoạt động</SelectItem>
                <SelectItem value="false">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
