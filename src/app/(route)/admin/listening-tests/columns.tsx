'use client';

import { DataTableColumnHeader } from '@/components/app/table/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LessonResponseSchema } from '@/lib/schema/listening-session.schema';
import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MoreHorizontal, Trash2 } from 'lucide-react';

interface ColumnProps {
  onDelete: (lesson: LessonResponseSchema) => void;
}

export const createColumns = ({ onDelete }: ColumnProps): ColumnDef<LessonResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tiêu đề" />;
    },
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      return (
        <div className="max-w-[300px]">
          <p className="line-clamp-2 text-sm">{title}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'level',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Độ khó" />;
    },
    cell: ({ row }) => {
      const level = row.getValue('level') as string;
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {level}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'total_sentences',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Số câu" />;
    },
    cell: ({ row }) => {
      const total = row.getValue('total_sentences') as number;
      return <div className="font-medium">{total}</div>;
    },
  },
  {
    accessorKey: 'youtube_url',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="YouTube URL" />;
    },
    cell: ({ row }) => {
      const url = row.getValue('youtube_url') as string;
      return (
        <div className="max-w-[200px]">
          <p className="text-muted-foreground line-clamp-1 text-xs">{url}</p>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Ngày tạo" />;
    },
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string | Date;
      return (
        <div className="text-sm">{format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const lesson = row.original;
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(lesson.id))}>
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(lesson)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
