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
import { PostResponseSchema } from '@/lib/schema/post.schema';
import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Eye, EyeOff, MoreHorizontal, Trash2 } from 'lucide-react';

interface ColumnProps {
  onDelete: (post: PostResponseSchema) => void;
  onTogglePublish: (post: PostResponseSchema) => void;
}

export const createColumns = ({
  onDelete,
  onTogglePublish,
}: ColumnProps): ColumnDef<PostResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  // {
  //   accessorKey: 'content',
  //   header: 'Nội dung',
  //   cell: ({ row }) => {
  //     const content = row.getValue('content') as string;
  //     return (
  //       <div className="max-w-[500px]">
  //         <p className="line-clamp-2 text-sm">{content}</p>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: 'author',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tác giả" />;
    },
    cell: ({ row }) => {
      const author = row.getValue('author') as PostResponseSchema['author'];
      return (
        <div className="flex flex-col">
          <span className="font-medium">{author.full_name || author.username}</span>
          <span className="text-muted-foreground text-xs">@{author.username}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'is_published',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Trạng thái" />;
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('is_published') as boolean;
      return (
        <Badge variant={isPublished ? 'default' : 'secondary'}>
          {isPublished ? 'Đã xuất bản' : 'Nháp'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'likes_count',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Lượt thích" />;
    },
    cell: ({ row }) => {
      const likes = row.getValue('likes_count') as number;
      return <div className="font-medium">{likes}</div>;
    },
  },
  {
    accessorKey: 'image_url',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Hình ảnh" />;
    },
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string | undefined;
      return (
        <div className="flex">
          {imageUrl ? (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Có
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700">
              Không
            </Badge>
          )}
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
      const post = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(post.id))}>
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTogglePublish(post)}>
                {post.is_published ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Chuyển thành nháp
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Xuất bản
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(post)} className="text-destructive">
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
