'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { BadgeCategoryResponseSchema } from '@/lib/schema/badge.schema';
import {
  useCreateBadgeCategoryMutation,
  useGetBadgeCategoriesQuery,
  useUpdateBadgeCategoryMutation,
} from '@/services/admin/badge-categories';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import BadgeCategoryFormSheet from './_components/BadgeCategoryFormSheet';
import { createBadgeCategoriesColumns } from './categories-columns';
import { DataTable } from './data-table';

const BadgeCategoriesTable = () => {
  const [selected, setSelected] = useState<BadgeCategoryResponseSchema | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const [searchTerm, setSearchTerm] = useState('');

  const { data } = useGetBadgeCategoriesQuery({
    page: filters.page,
    size: filters.size,
    include_inactive: true,
  });

  const createMutation = useCreateBadgeCategoryMutation();
  const updateMutation = useUpdateBadgeCategoryMutation();

  const columns = useMemo(() => createBadgeCategoriesColumns(), []);

  const rows = useMemo(() => {
    const items = data?.data?.items ?? [];
    if (!searchTerm.trim()) return items;
    const q = searchTerm.trim().toLowerCase();
    return items.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [data?.data?.items, searchTerm]);

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setFilters((prev) => ({
      ...prev,
      page: newPagination.pageIndex + 1,
      size: newPagination.pageSize,
    }));
  };

  const openCreate = () => {
    setIsCreateMode(true);
    setSelected({
      id: 0,
      code: '',
      name: '',
      description: null,
      is_active: true,
    });
    setIsSheetOpen(true);
  };

  const openEdit = (category: BadgeCategoryResponseSchema) => {
    setIsCreateMode(false);
    setSelected(category);
    setIsSheetOpen(true);
  };

  const canSubmit = Boolean(selected?.code?.trim()) && Boolean(selected?.name?.trim());

  const submit = () => {
    if (!selected) return;
    if (!canSubmit) {
      toast.error('Vui lòng nhập đầy đủ code và tên nhóm');
      return;
    }

    if (isCreateMode) {
      createMutation.mutate(
        {
          code: selected.code.trim(),
          name: selected.name.trim(),
          description: selected.description ?? null,
          is_active: Boolean(selected.is_active),
        },
        {
          onSuccess: () => {
            toast.success('Tạo nhóm danh hiệu thành công');
            setIsSheetOpen(false);
            setSelected(null);
          },
          onError: (e) => {
            toast.error(e?.detail || 'Có lỗi xảy ra khi tạo nhóm danh hiệu');
          },
        }
      );
      return;
    }

    updateMutation.mutate(
      {
        categoryId: selected.id,
        data: {
          name: selected.name.trim(),
          description: selected.description ?? null,
          is_active: Boolean(selected.is_active),
        },
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật nhóm danh hiệu thành công');
          setIsSheetOpen(false);
          setSelected(null);
        },
        onError: (e) => {
          toast.error(e?.detail || 'Có lỗi xảy ra khi cập nhật nhóm danh hiệu');
        },
      }
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Nhóm danh hiệu</h2>
          <p className="text-muted-foreground text-sm">Tạo nhóm để gom các danh hiệu</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo nhóm
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        onRowClick={openEdit}
        pageCount={data?.data?.total ? Math.ceil(data.data.total / filters.size) : 0}
        pageIndex={filters.page - 1}
        pageSize={filters.size}
        onPaginationChange={handlePaginationChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm code, tên nhóm..."
      />

      <BadgeCategoryFormSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selected={selected}
        setSelected={(next) => setSelected(next)}
        isCreateMode={isCreateMode}
        onSubmit={submit}
        submitDisabled={!canSubmit || createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
};

export default BadgeCategoriesTable;
