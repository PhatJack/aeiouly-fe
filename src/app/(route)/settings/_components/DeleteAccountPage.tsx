'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import SettingHeader from '@/components/app/settings/SettingHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteAccountMutation } from '@/services/auth/delete-account.api';

import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteAccountPage() {
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteAccountMutation = useDeleteAccountMutation();

  const handleDeleteAccount = () => {
    if (!isValidConfirmation) {
      toast.error('Vui lòng nhập chính xác cụm từ xác nhận');
      return;
    }

    deleteAccountMutation.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(data?.message || 'Tài khoản của bạn đã được xóa thành công');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      },
      onError: (error: any) => {
        const errorMessage = error?.detail || error?.message || 'Đã xảy ra lỗi khi xóa tài khoản';
        toast.error(errorMessage);
      },
    });
  };

  const isValidConfirmation = confirmText.toLowerCase() === 'xoá tài khoản';

  return (
    <div className="space-y-8">
      <SettingHeader
        title="Xóa tài khoản"
        description="Hành động này không thể hoàn tác"
        src={'/settingIcon/trash-bin.png'}
        className="text-destructive"
      />

      <div className="max-w-2xl space-y-6">
        {!showConfirm ? (
          <div className="space-y-4">
            <p className="text-foreground/80 text-base">Trước khi xóa tài khoản, vui lòng lưu ý:</p>
            <ul className="text-foreground/80 list-disc space-y-2 pl-6 text-sm font-medium">
              <li>Tất cả dữ liệu cá nhân của bạn sẽ bị xóa vĩnh viễn</li>
              <li>Bạn sẽ mất quyền truy cập vào tất cả các khóa học và tài nguyên</li>
              <li>Không thể khôi phục tài khoản sau khi xóa</li>
              <li>Mọi đăng ký hiện tại sẽ bị hủy bỏ</li>
            </ul>

            <div className="pt-4">
              <Button
                variant="destructive"
                onClick={() => setShowConfirm(true)}
                className="w-full sm:w-auto"
              >
                Tôi hiểu rủi ro, vẫn muốn xóa tài khoản
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="confirm">
                Để xác nhận, vui lòng nhập{' '}
                <span className="bg-primary rounded-sm px-2 py-1 font-bold">xóa tài khoản</span> vào
                ô bên dưới:
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-4">
              <div className="flex">
                <ShieldAlert className="text-destructive mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-destructive font-medium">
                    Bạn có chắc chắn muốn xóa tài khoản?
                  </h3>
                  <p className="text-destructive/80 text-sm">
                    Hành động này sẽ xóa vĩnh viễn tất cả dữ liệu của bạn trên nền tảng này.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={!isValidConfirmation || deleteAccountMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {'Có, xóa tài khoản của tôi'}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={deleteAccountMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
