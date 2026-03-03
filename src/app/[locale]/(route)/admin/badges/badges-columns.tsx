'use client';

import Image from 'next/image';

import { DataTableColumnHeader } from '@/components/app/table/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { BadgeResponseSchema } from '@/lib/schema/badge.schema';
import { ColumnDef } from '@tanstack/react-table';

export const createBadgesColumns = (opts: {
  categoryNameById: Map<number, string>;
}): ColumnDef<BadgeResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    size: 50,
  },
  {
    accessorKey: 'image_url',
    header: () => <div>Ảnh</div>,
    cell: ({ row }) => {
      const url = row.getValue('image_url') as string | null | undefined;
      return url ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-md border">
          <Image src={url} alt="badge" fill className="object-contain" unoptimized />
        </div>
      ) : (
        <div className="text-muted-foreground text-xs">-</div>
      );
    },
    enableSorting: false,
    size: 70,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('code')}</div>,
    minSize: 150,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    minSize: 220,
  },
  {
    accessorKey: 'rarity',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Độ hiếm" />,
    cell: ({ row }) => {
      const rarity = row.getValue('rarity') as string;
      return <Badge variant="secondary">{rarity}</Badge>;
    },
    size: 120,
  },
  {
    accessorKey: 'badge_category_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nhóm" />,
    cell: ({ row }) => {
      const categoryId = row.getValue('badge_category_id') as number | null | undefined;
      if (!categoryId) return <span className="text-muted-foreground text-xs">Không nhóm</span>;
      return (
        <span className="text-sm">{opts.categoryNameById.get(categoryId) || `#${categoryId}`}</span>
      );
    },
    enableSorting: false,
    minSize: 180,
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
