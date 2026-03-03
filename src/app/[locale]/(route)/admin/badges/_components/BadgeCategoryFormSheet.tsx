'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BadgeCategoryResponseSchema } from '@/lib/schema/badge.schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: BadgeCategoryResponseSchema | null;
  setSelected: (next: BadgeCategoryResponseSchema) => void;
  isCreateMode: boolean;
  onSubmit: () => void;
  submitDisabled?: boolean;
};

const BadgeCategoryFormSheet = ({
  open,
  onOpenChange,
  selected,
  setSelected,
  isCreateMode,
  onSubmit,
  submitDisabled,
}: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        {selected && (
          <>
            <SheetHeader className="mt-5">
              <SheetTitle>
                {isCreateMode ? 'Tạo nhóm danh hiệu' : `Cập nhật nhóm #${selected.id}`}
              </SheetTitle>
              <SheetDescription>
                Quản lý nhóm để gán vào các danh hiệu (badge_categories)
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 px-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={selected.code}
                  onChange={(e) => setSelected({ ...selected, code: e.target.value })}
                  disabled={!isCreateMode}
                  placeholder="VD: LOGIN_STREAK"
                />
              </div>

              <div className="space-y-2">
                <Label>Tên nhóm</Label>
                <Input
                  value={selected.name}
                  onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                  placeholder="VD: Đăng nhập liên tiếp"
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={selected.description ?? ''}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value || null })
                  }
                  placeholder="Mô tả ngắn (optional)"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label>Hoạt động</Label>
                  <p className="text-muted-foreground text-xs">Ẩn/hiện nhóm</p>
                </div>
                <Switch
                  checked={Boolean(selected.is_active)}
                  onCheckedChange={(v) => setSelected({ ...selected, is_active: v })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                  Hủy
                </Button>
                <Button onClick={onSubmit} disabled={submitDisabled}>
                  {isCreateMode ? 'Tạo' : 'Lưu'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BadgeCategoryFormSheet;
