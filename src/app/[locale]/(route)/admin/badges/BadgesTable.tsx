'use client';

import React, { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { BadgeCategoryResponseSchema, BadgeResponseSchema } from '@/lib/schema/badge.schema';
import { useGetBadgeCategoriesQuery } from '@/services/admin/badge-categories';
import {
  useCreateBadgeMutation,
  useGetBadgesQuery,
  useUpdateBadgeMutation,
} from '@/services/badges';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import BadgeFormSheet from './_components/BadgeFormSheet';
import { createBadgesColumns } from './badges-columns';
import { DataTable, SimpleOption } from './data-table';

const BadgesTable = () => {
  const [selected, setSelected] = useState<BadgeResponseSchema | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { data: categoriesRes } = useGetBadgeCategoriesQuery({
    page: 1,
    size: 100,
    include_inactive: true,
  });

  const badgeCategoryItems = useMemo(
    () => categoriesRes?.data?.items ?? [],
    [categoriesRes?.data?.items]
  );

  const badgeCategoryOptions: SimpleOption[] = useMemo(() => {
    return badgeCategoryItems
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id)
      .map((c: BadgeCategoryResponseSchema) => ({
        value: String(c.id),
        label: `${c.name} (${c.code})`,
      }));
  }, [badgeCategoryItems]);

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const c of badgeCategoryItems) map.set(c.id, c.name);
    return map;
  }, [badgeCategoryItems]);

  const badgeCategoryIdParam = useMemo(() => {
    if (categoryFilter === 'all') return undefined;
    if (categoryFilter === 'none') return null;
    const parsed = Number(categoryFilter);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [categoryFilter]);

  const { data } = useGetBadgesQuery({
    page: filters.page,
    size: filters.size,
    include_inactive: true,
    query: searchTerm || undefined,
    badge_category_id: badgeCategoryIdParam,
  });

  const createMutation = useCreateBadgeMutation();
  const updateMutation = useUpdateBadgeMutation();

  const columns = useMemo(() => createBadgesColumns({ categoryNameById }), [categoryNameById]);

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
      rarity: 'common',
      category: null,
      badge_category_id: null,
      image_url: null,
      is_active: true,
    });
    setIsSheetOpen(true);
  };

  const openEdit = (badge: BadgeResponseSchema) => {
    setIsCreateMode(false);
    setSelected(badge);
    setIsSheetOpen(true);
  };

  const canSubmit =
    Boolean(selected?.name?.trim()) && (isCreateMode ? Boolean(selected?.code?.trim()) : true);

  const submit = () => {
    if (!selected) return;
    if (!canSubmit) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    const payloadBase = {
      name: selected.name.trim(),
      description: selected.description ?? null,
      rarity: selected.rarity,
      category: selected.category ?? null,
      badge_category_id: selected.badge_category_id ?? null,
      image_url: selected.image_url ?? null,
      is_active: Boolean(selected.is_active),
    };

    if (isCreateMode) {
      createMutation.mutate(
        {
          code: selected.code.trim(),
          ...payloadBase,
        },
        {
          onSuccess: () => {
            toast.success('Tạo danh hiệu thành công');
            setIsSheetOpen(false);
            setSelected(null);
          },
          onError: (e) => {
            toast.error(e?.detail || 'Có lỗi xảy ra khi tạo danh hiệu');
          },
        }
      );
      return;
    }

    updateMutation.mutate(
      {
        badgeId: selected.id,
        data: payloadBase,
      },
      {
        onSuccess: () => {
          toast.success('Cập nhật danh hiệu thành công');
          setIsSheetOpen(false);
          setSelected(null);
        },
        onError: (e) => {
          toast.error(e?.detail || 'Có lỗi xảy ra khi cập nhật danh hiệu');
        },
      }
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Danh hiệu</h2>
          <p className="text-muted-foreground text-sm">Tạo/cập nhật danh hiệu và gán nhóm</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo danh hiệu
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data?.items || []}
        onRowClick={openEdit}
        pageCount={data?.data?.total ? Math.ceil(data.data.total / filters.size) : 0}
        pageIndex={filters.page - 1}
        pageSize={filters.size}
        onPaginationChange={handlePaginationChange}
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setFilters((prev) => ({ ...prev, page: 1 }));
        }}
        categoryOptions={badgeCategoryOptions}
        categoryFilter={categoryFilter}
        onCategoryChange={(value) => {
          setCategoryFilter(value);
          setFilters((prev) => ({ ...prev, page: 1 }));
        }}
        searchPlaceholder="Tìm kiếm code, tên danh hiệu..."
      />

      <BadgeFormSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selected={selected}
        setSelected={(next) => setSelected(next)}
        isCreateMode={isCreateMode}
        badgeCategoryOptions={badgeCategoryOptions}
        onSubmit={submit}
        submitDisabled={!canSubmit || createMutation.isPending || updateMutation.isPending}
      />
    </>
  );
};

export default BadgesTable;
