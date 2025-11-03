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
import { BackgroundVideoResponseSchema } from '@/lib/schema/background-video.schema';
import { BackgroundVideoTypeResponseSchema } from '@/lib/schema/background-video.schema';
import { SoundResponseSchema } from '@/lib/schema/sound.schema';
import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Image, MoreHorizontal, Trash2, Upload, Youtube } from 'lucide-react';

interface ColumnProps {
  onDelete: (sound: SoundResponseSchema) => void;
}

export const createColumns = ({ onDelete }: ColumnProps): ColumnDef<SoundResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tên âm thanh" />;
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="max-w-[300px] truncate font-medium">{name}</div>;
    },
  },
  {
    accessorKey: 'sound_file_url',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="File âm thanh" />;
    },
    cell: ({ row }) => {
      const soundFileUrl = row.getValue('sound_file_url') as string | null;
      return (
        <div className="flex">
          {soundFileUrl ? (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Upload className="mr-1 h-3 w-3" />
              Có file
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700">
              Chưa upload
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'file_size',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Kích thước" />;
    },
    cell: ({ row }) => {
      const fileSize = row.getValue('file_size') as number | null;
      if (!fileSize) return <div className="text-muted-foreground">-</div>;

      const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
      return <div className="font-medium">{sizeInMB} MB</div>;
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Thời lượng" />;
    },
    cell: ({ row }) => {
      const duration = row.getValue('duration') as number | null;
      if (!duration) return <div className="text-muted-foreground">-</div>;

      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return (
        <div className="font-medium">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      );
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
      const sound = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(sound.id))}>
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(sound)} className="text-destructive">
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

interface BackgroundVideoColumnProps {
  onDelete: (video: BackgroundVideoResponseSchema) => void;
}

export const createBackgroundVideoColumns = ({
  onDelete,
}: BackgroundVideoColumnProps): ColumnDef<BackgroundVideoResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'youtube_url',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="URL YouTube" />;
    },
    cell: ({ row }) => {
      const url = row.getValue('youtube_url') as string;
      return (
        <div className="flex max-w-[300px] items-center gap-2">
          <Youtube className="h-4 w-4 flex-shrink-0 text-red-500" />
          <span className="truncate text-sm">{url}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'type_name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Loại" />;
    },
    cell: ({ row }) => {
      const typeName = row.getValue('type_name') as string | null;
      return <div className="font-medium">{typeName || 'Không xác định'}</div>;
    },
  },
  {
    accessorKey: 'image_url',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Hình ảnh" />;
    },
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string | null;
      return (
        <div className="flex">
          {imageUrl ? (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Image className="mr-1 h-3 w-3" />
              Có hình
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700">
              Không có hình
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
      const video = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(video.id))}>
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(video)} className="text-destructive">
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

interface BackgroundVideoTypeColumnProps {
  onDelete: (type: BackgroundVideoTypeResponseSchema) => void;
}

export const createBackgroundVideoTypeColumns = ({
  onDelete,
}: BackgroundVideoTypeColumnProps): ColumnDef<BackgroundVideoTypeResponseSchema>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Tên loại" />;
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Mô tả" />;
    },
    cell: ({ row }) => {
      const description = row.getValue('description') as string | null;
      return (
        <div className="max-w-[300px]">
          <p className="line-clamp-2 text-sm">{description || 'Không có mô tả'}</p>
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
    header: 'Hành động',
    cell: ({ row }) => {
      const type = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(type.id))}>
                Sao chép ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(type)} className="text-destructive">
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
