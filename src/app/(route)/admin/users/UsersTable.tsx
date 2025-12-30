'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useDebounceValue } from '@/hooks/use-debounce-value';
import { UserResponseSchema } from '@/lib/schema/user.schema';
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useResetUserPasswordMutation,
  useUpdateUserMutation,
} from '@/services/admin/users';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Lock, Shield, Trash2, User, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

import { createColumns } from './columns';
import { DataTable } from './data-table';

const UsersTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedUser, setSelectedUser] = useState<UserResponseSchema | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponseSchema | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [filters, setFilters] = useState({
    page: Number(searchParams.get('page')) || 1,
    size: Number(searchParams.get('size')) || 10,
    query: searchParams.get('query') || '',
    role: (searchParams.get('role') as 'user' | 'admin' | undefined) || undefined,
    is_active: searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined,
  });
  const [searchTerm, setSearchTerm] = useState(filters.query);
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 300);
  const { data } = useGetAllUsersQuery(filters);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: debouncedSearchTerm,
      page: debouncedSearchTerm !== prev.query ? 1 : prev.page,
    }));
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page !== 1) params.set('page', filters.page.toString());
    if (filters.size !== 10) params.set('size', filters.size.toString());
    if (filters.query) {
      params.set('query', filters.query);
    }
    if (filters.role) params.set('role', filters.role);
    if (filters.is_active !== undefined) params.set('is_active', filters.is_active.toString());
    if (params.toString() === searchParams.toString()) return;
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/admin/users${newUrl}`, { scroll: false });
  }, [filters, router]);

  const deleteUserMutation = useDeleteUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetUserPasswordMutation();

  const handleRowClick = (user: UserResponseSchema) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleDelete = (user: UserResponseSchema) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    deleteUserMutation.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success('Xóa người dùng thành công!');
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        if (selectedUser?.id === userToDelete.id) {
          setIsSheetOpen(false);
          setSelectedUser(null);
        }
      },
      onError: () => {
        toast.error('Có lỗi xảy ra khi xóa người dùng');
      },
    });
  };

  const handleToggleActive = (user: UserResponseSchema) => {
    updateUserMutation.mutate(
      {
        userId: user.id,
        data: { is_active: !user.is_active },
      },
      {
        onSuccess: () => {
          toast.success(
            user.is_active
              ? 'Vô hiệu hóa người dùng thành công!'
              : 'Kích hoạt người dùng thành công!'
          );
          if (selectedUser?.id === user.id) {
            setSelectedUser({ ...user, is_active: !user.is_active });
          }
        },
        onError: () => {
          toast.error('Có lỗi xảy ra');
        },
      }
    );
  };

  const handleResetPassword = (user: UserResponseSchema) => {
    setNewPassword('');
    setResetPasswordDialogOpen(true);
  };

  const confirmResetPassword = () => {
    if (!selectedUser || !newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    resetPasswordMutation.mutate(
      {
        userId: selectedUser.id,
        data: { new_password: newPassword },
      },
      {
        onSuccess: () => {
          toast.success('Đặt lại mật khẩu thành công!');
          setResetPasswordDialogOpen(false);
          setNewPassword('');
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi đặt lại mật khẩu');
        },
      }
    );
  };

  const columns = createColumns({
    onDelete: handleDelete,
    onToggleActive: handleToggleActive,
    onResetPassword: handleResetPassword,
  });

  const handlePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setFilters((prev) => ({
      ...prev,
      page: newPagination.pageIndex + 1, // API uses 1-based pagination
      size: newPagination.pageSize,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: value === 'all' ? undefined : (value as 'user' | 'admin'),
      page: 1,
    }));
  };

  const handleIsActiveChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      is_active: value === 'all' ? undefined : value === 'true',
      page: 1,
    }));
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
          <p className="text-muted-foreground text-sm">Xem và quản lý tất cả người dùng</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items || []}
        onRowClick={handleRowClick}
        pageCount={data?.total ? Math.ceil(data.total / filters.size) : 0}
        pageIndex={filters.page - 1} // Table uses 0-based pagination
        pageSize={filters.size}
        onPaginationChange={handlePaginationChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={filters.role || 'all'}
        onRoleChange={handleRoleChange}
        isActiveFilter={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
        onIsActiveChange={handleIsActiveChange}
      />

      {/* Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          {selectedUser && (
            <>
              <SheetHeader className="mt-5">
                <SheetTitle className="flex items-center justify-between">
                  <span>Chi tiết người dùng #{selectedUser.id}</span>
                  <div className="flex gap-2">
                    <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedUser.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </Badge>
                    <Badge variant={selectedUser.is_active ? 'default' : 'secondary'}>
                      {selectedUser.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Xem và quản lý thông tin chi tiết của người dùng
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-auto overflow-y-auto pb-4">
                <div className="space-y-4 px-4">
                  {/* Avatar */}
                  {selectedUser.avatar_url && (
                    <div className="flex justify-center">
                      <div className="border-primary relative h-24 w-24 overflow-hidden rounded-full border-4">
                        <Image
                          src={selectedUser.avatar_url}
                          alt={selectedUser.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* User Info */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4" />
                      Thông tin cá nhân
                    </h3>
                    <div className="space-y-3 rounded-lg border p-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Tên đăng nhập</p>
                        <p className="font-medium">@{selectedUser.username}</p>
                      </div>
                      {selectedUser.full_name && (
                        <div>
                          <p className="text-muted-foreground text-xs">Họ và tên</p>
                          <p className="font-medium">{selectedUser.full_name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Role & Status */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Shield className="h-4 w-4" />
                      Vai trò & Trạng thái
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground mb-2 text-xs">Vai trò</p>
                        <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                          {selectedUser.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                        </Badge>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground mb-2 text-xs">Trạng thái</p>
                        <Badge variant={selectedUser.is_active ? 'default' : 'secondary'}>
                          {selectedUser.is_active ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Timestamps */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Calendar className="h-4 w-4" />
                      Thời gian
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <p className="text-muted-foreground mb-2 text-xs">Ngày tạo</p>
                        <p className="text-sm font-medium">
                          {format(new Date(selectedUser.created_at!), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(selectedUser.created_at!), 'HH:mm', { locale: vi })}
                        </p>
                      </div>
                      {selectedUser.updated_at && (
                        <div className="rounded-lg border p-4">
                          <p className="text-muted-foreground mb-2 text-xs">Cập nhật lần cuối</p>
                          <p className="text-sm font-medium">
                            {format(new Date(selectedUser.updated_at), 'dd/MM/yyyy', {
                              locale: vi,
                            })}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {format(new Date(selectedUser.updated_at), 'HH:mm', { locale: vi })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="space-y-2">
                    <h3 className="mb-3 text-sm font-semibold">Hành động</h3>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleToggleActive(selectedUser)}
                        disabled={updateUserMutation.isPending}
                      >
                        {selectedUser.is_active ? (
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
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleResetPassword(selectedUser)}
                        disabled={resetPasswordMutation.isPending}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Đặt lại mật khẩu
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleDelete(selectedUser)}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa người dùng
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Người dùng và tất cả dữ liệu liên quan sẽ bị xóa
              vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Đặt lại mật khẩu</AlertDialogTitle>
            <AlertDialogDescription>
              Nhập mật khẩu mới cho người dùng @{selectedUser?.username}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewPassword('')}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword} disabled={!newPassword}>
              Đặt lại mật khẩu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTable;
