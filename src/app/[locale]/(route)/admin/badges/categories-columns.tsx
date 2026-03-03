'use client';

import { DataTableColumnHeader } from '@/components/app/table/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { BadgeCategoryResponseSchema } from '@/lib/schema/badge.schema';
import { ColumnDef } from '@tanstack/react-table';

export const createBadgeCategoriesColumns = (): ColumnDef<BadgeCategoryResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    size: 60,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('code')}</div>,
    minSize: 180,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nhóm" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    minSize: 240,
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Hoạt động' : 'Ẩn'}</Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)));
    },
    size: 120,
  },
];
