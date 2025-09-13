'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import SettingHeader from '@/components/app/settings/SettingHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { AlertCircle, ShieldAlert, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to delete the account
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful account deletion
      toast.success('Tài khoản của bạn đã được xóa thành công');

      // Redirect to home or login page after deletion
      router.push('/');

      // Here you would typically clear user session and redirect
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Đã xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidConfirmation = confirmText.toLowerCase() === 'xóa tài khoản';

  return (
    <div className="space-y-8">
      <SettingHeader
        title="Xóa tài khoản"
        description="Hành động này không thể hoàn tác"
        Icon={Trash2}
        className="text-destructive"
      />

      <div className="max-w-2xl space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cảnh báo</AlertTitle>
          <AlertDescription>
            Việc xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn
            tác.
          </AlertDescription>
        </Alert>

        {!showConfirm ? (
          <div className="space-y-4">
            <p className="text-foreground/80">Trước khi xóa tài khoản, vui lòng lưu ý:</p>
            <ul className="text-foreground/80 list-disc space-y-2 pl-6">
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
                Để xác nhận, vui lòng nhập <span className="font-bold">xóa tài khoản</span> vào ô
                bên dưới:
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="xóa tài khoản"
                className="max-w-md"
              />
            </div>

            <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
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
                  onClick={handleDeleteAccount}
                  disabled={!isValidConfirmation || isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? 'Đang xử lý...' : 'Có, xóa tài khoản của tôi'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoading}
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
