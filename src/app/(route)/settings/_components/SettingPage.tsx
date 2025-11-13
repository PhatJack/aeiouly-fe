'use client';

import { useState } from 'react';

import EditAvatarSetting from '@/components/app/settings/EditAvatarSetting';
import EditFieldDialog from '@/components/app/settings/EditFieldDialog';
import SettingHeader from '@/components/app/settings/SettingHeader';
import { ModeToggle } from '@/components/mode-toggle';
import { WaveAnimation } from '@/components/shared/WaveAnimation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/contexts/AuthContext';
import { UserUpdateSchema, userUpdateSchema } from '@/lib/schema/user.schema';
import { useUpdateMeMutation } from '@/services/auth/update-me.api';

import { toast } from 'sonner';

const SettingPage = () => {
  const user = useAuthStore((state) => state.user);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openFullNameDialog, setOpenFullNameDialog] = useState(false);

  const updateMeMutation = useUpdateMeMutation();

  const handleUpdateInformation = (data: UserUpdateSchema, fieldName: keyof UserUpdateSchema) => {
    if (fieldName === 'full_name') {
      updateMeMutation.mutate(
        { full_name: data.full_name },
        {
          onSuccess: () => {
            toast.success('Cập nhật tên thành công');
          },
        }
      );
      return;
    }
    if (fieldName === 'email') {
      updateMeMutation.mutate(
        { email: data.email },
        {
          onSuccess: () => {
            toast.success('Cập nhật email thành công');
          },
        }
      );
      return;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <SettingHeader
        title="Hồ sơ cá nhân"
        src={'/settingIcon/account.png'}
        description="Quản lý và chỉnh sửa thông tin tài khoản của bạn"
      />

      <div className="space-y-4">
        <Label className="text-lg font-semibold">Thông tin cá nhân</Label>
        <div className="rounded-xl border">
          <div className="divide-y">
            {/* Avatar Section */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-4">
                  <Label className="font-medium text-gray-500">Ảnh đại diện</Label>
                  <EditAvatarSetting />
                </div>
              </div>
            </div>
            {/* Username Section */}
            <div className="p-4">
              <div>
                <Label className="font-medium text-gray-500">Username</Label>
                <p className="mt-1 font-medium">{user?.username || 'Chưa cập nhật'}</p>
              </div>
            </div>

            {/* Full Nam Section */}
            <div className="flex items-center justify-between p-4">
              <div>
                <Label className="font-medium text-gray-500">Full Name</Label>
                <p className="mt-1 font-medium">{user?.full_name || 'Chưa cập nhật'}</p>
              </div>
              <Button variant="outline" onClick={() => setOpenFullNameDialog(true)}>
                Sửa
              </Button>
            </div>

            {/* Email Section */}
            <div className="flex items-center justify-between p-4">
              <div>
                <Label className="font-medium text-gray-500">Email</Label>
                <p className="mt-1 font-medium">{user?.email || 'Chưa cập nhật'}</p>
              </div>
              <Button variant="outline" onClick={() => setOpenEmailDialog(true)}>
                Sửa
              </Button>
            </div>
          </div>
        </div>
      </div>
      {user?.role === 'user' ? (
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Thống kê học tập</Label>
          <div className="space-y-4 divide-y">
            <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border p-4">
              <p className="font-semibold">
                Tôi đã <span className="text-primary">mở miệng nói tiếng Anh</span> được
              </p>
              <div className="bg-background flex aspect-square size-20 items-center justify-center rounded-full border p-4">
                <p className="text-primary text-5xl font-bold">7</p>
              </div>
              <p className="font-semibold">lần</p>
            </div>
            <div className="grid w-full gap-4 lg:grid-cols-2">
              <div className="relative min-h-44 w-full overflow-hidden rounded-xl border p-4 font-semibold">
                <p className="text-lg">
                  Tôi <span className="text-primary">sắp nói được tiếng anh</span> vì đã mở miệng
                  được
                </p>
                <p className="mt-2 text-3xl font-bold">
                  <span className="text-primary">1</span> / 100 giờ
                </p>
                <WaveAnimation color="#ff7429" className="max-h-5" speed={20} />
              </div>
              <div className="relative min-h-44 w-full overflow-hidden rounded-xl border p-4 font-semibold">
                <p className="text-lg">
                  Tôi <span className="text-secondary">đã vượt qua cơn lười học</span> của bản thân
                  được
                </p>
                <p className="mt-2 text-3xl font-bold">
                  <span className="text-secondary">1</span> ngày
                </p>
                <WaveAnimation color="#24d0a3" className="h-full max-h-12" speed={10} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Giao diện</Label>
        <div className="rounded-xl border">
          <div className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <Label className="font-medium text-gray-500">Chủ đề</Label>
                <p className="mt-1 font-medium">Chuyển đổi giao diện đen/trắng</p>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Email Dialog */}
      <EditFieldDialog
        open={openEmailDialog}
        onOpenChange={setOpenEmailDialog}
        title="Cập nhật Email"
        fieldLabel="Email mới"
        fieldName="email"
        fieldType="email"
        currentValue={user?.email || ''}
        placeholder="Nhập email mới"
        onSubmit={handleUpdateInformation}
        validationSchema={userUpdateSchema.pick({ email: true })}
      />

      {/* Edit Full Name Dialog */}
      <EditFieldDialog
        open={openFullNameDialog}
        onOpenChange={setOpenFullNameDialog}
        title="Cập nhật Họ và Tên"
        fieldLabel="Họ và Tên"
        fieldName="full_name"
        currentValue={user?.full_name || ''}
        placeholder="Nhập họ và tên"
        onSubmit={handleUpdateInformation}
        validationSchema={userUpdateSchema.pick({ full_name: true })}
      />
    </div>
  );
};

export default SettingPage;
