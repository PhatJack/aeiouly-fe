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
import { UserResponseSchema } from '@/lib/schema/user.schema';
import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Lock, MoreHorizontal, Trash2, UserCheck, UserX } from 'lucide-react';

interface ColumnProps {
  onDelete: (user: UserResponseSchema) => void;
  onToggleActive: (user: UserResponseSchema) => void;
  onResetPassword: (user: UserResponseSchema) => void;
}

export const createColumns = ({
  onDelete,
  onToggleActive,
  onResetPassword,
}: ColumnProps): ColumnDef<UserResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tên đăng nhập" />;
    },
    cell: ({ row }) => {
      const username = row.getValue('username') as string;
      return <div className="font-medium">@{username}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return <div className="text-sm">{email}</div>;
    },
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Họ và tên" />;
    },
    cell: ({ row }) => {
      const fullName = row.getValue('full_name') as string | null;
      return (
        <div className="text-sm">
          {fullName || <span className="text-muted-foreground">—</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Vai trò" />;
    },
    cell: ({ row }) => {
      const role = row.getValue('role') as 'user' | 'admin';
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
          {role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Trạng thái" />;
    },
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
      const user = row.original;
      return (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.id))}>
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleActive(user)}>
                {user.is_active ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Vô hiệu hóa
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Kích hoạt
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResetPassword(user)}>
                <Lock className="mr-2 h-4 w-4" />
                Đặt lại mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(user)} className="text-destructive">
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
