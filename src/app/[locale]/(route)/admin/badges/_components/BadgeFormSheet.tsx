'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BadgeResponseSchema } from '@/lib/schema/badge.schema';

import { SimpleOption } from '../data-table';

const rarityOptions = [
  { value: 'common', label: 'common' },
  { value: 'rare', label: 'rare' },
  { value: 'epic', label: 'epic' },
  { value: 'legendary', label: 'legendary' },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: BadgeResponseSchema | null;
  setSelected: (next: BadgeResponseSchema) => void;
  isCreateMode: boolean;
  badgeCategoryOptions: SimpleOption[];
  onSubmit: () => void;
  submitDisabled?: boolean;
};

const BadgeFormSheet = ({
  open,
  onOpenChange,
  selected,
  setSelected,
  isCreateMode,
  badgeCategoryOptions,
  onSubmit,
  submitDisabled,
}: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        {selected && (
          <>
            <SheetHeader className="mt-5">
              <SheetTitle>
                {isCreateMode ? 'Tạo danh hiệu' : `Cập nhật danh hiệu #${selected.id}`}
              </SheetTitle>
              <SheetDescription>
                Bạn có thể gán danh hiệu vào nhóm (badge_categories) để dễ quản lý
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 px-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input
                    value={selected.code}
                    onChange={(e) => setSelected({ ...selected, code: e.target.value })}
                    disabled={!isCreateMode}
                    placeholder="VD: DAY_7"
                  />
                  {!isCreateMode ? (
                    <p className="text-muted-foreground text-xs">
                      Code không hỗ trợ đổi sau khi tạo
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>Tên</Label>
                  <Input
                    value={selected.name}
                    onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                    placeholder="VD: 7 ngày liên tiếp"
                  />
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nhóm danh hiệu</Label>
                  <Select
                    value={selected.badge_category_id ? String(selected.badge_category_id) : 'none'}
                    onValueChange={(v) =>
                      setSelected({
                        ...selected,
                        badge_category_id: v === 'none' ? null : Number(v),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không nhóm</SelectItem>
                      {badgeCategoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Độ hiếm</Label>
                  <Select
                    value={selected.rarity}
                    onValueChange={(v) => setSelected({ ...selected, rarity: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ hiếm" />
                    </SelectTrigger>
                    <SelectContent>
                      {rarityOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Category (legacy)</Label>
                  <Input
                    value={selected.category ?? ''}
                    onChange={(e) => setSelected({ ...selected, category: e.target.value || null })}
                    placeholder="Optional (legacy field)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={selected.image_url ?? ''}
                  onChange={(e) => setSelected({ ...selected, image_url: e.target.value || null })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <Label>Ẩn danh hiệu</Label>
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

export default BadgeFormSheet;
