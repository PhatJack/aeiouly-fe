'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import EditAvatarSetting from '@/components/app/settings/EditAvatarSetting';
import EditFieldDialog from '@/components/app/settings/EditFieldDialog';
import { WaveAnimation } from '@/components/shared/WaveAnimation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/contexts/AuthContext';
import { UserUpdateSchema, userUpdateSchema } from '@/lib/schema/user.schema';
import { useUpdateMeMutation } from '@/services/auth/update-me.api';

import { toast } from 'sonner';

import StreakSection from './StreakSection';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const t = useTranslations('profile');
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openFullNameDialog, setOpenFullNameDialog] = useState(false);

  const updateMeMutation = useUpdateMeMutation();

  const handleUpdateInformation = (data: UserUpdateSchema, fieldName: keyof UserUpdateSchema) => {
    if (fieldName === 'full_name') {
      updateMeMutation.mutate(
        { full_name: data.full_name },
        {
          onSuccess: () => {
            toast.success(t('updateSuccess.fullName'));
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
            toast.success(t('updateSuccess.email'));
          },
        }
      );
      return;
    }
  };

  return (
    <div className="mx-auto grid w-full gap-4 xl:grid-cols-12">
      <div className="w-full space-y-4 xl:col-span-4">
        <StreakSection />
        {/* <div className="relative min-h-44 w-full overflow-hidden rounded-xl border p-4 font-semibold">
          <p className="text-lg">
            Tôi <span className="text-primary">sắp nói được tiếng anh</span> vì đã mở miệng được
          </p>
          <p className="mt-2 text-3xl font-bold">
            <span className="text-primary">1</span> / 100 giờ
          </p>
          <WaveAnimation color="#ff7429" className="max-h-5" speed={20} />
        </div>
        <div className="relative min-h-44 w-full overflow-hidden rounded-xl border p-4 font-semibold">
          <p className="text-lg">
            Tôi <span className="text-secondary">đã vượt qua cơn lười học</span> của bản thân được
          </p>
          <p className="mt-2 text-3xl font-bold">
            <span className="text-secondary">1</span> ngày
          </p>
          <WaveAnimation color="#24d0a3" className="h-full max-h-12" speed={10} />
        </div> */}
      </div>
      <div className="space-y-4 xl:col-span-8">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border">
            <div className="bg-card text-card-foreground divide-y">
              {/* Avatar Section */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-4">
                    <Label className="font-medium text-gray-500">{t('avatar')}</Label>
                    <EditAvatarSetting />
                  </div>
                </div>
              </div>
              {/* Username Section */}
              <div className="p-4">
                <div>
                  <Label className="font-medium text-gray-500">{t('username')}</Label>
                  <p className="mt-1 font-medium">{user?.username || t('notUpdated')}</p>
                </div>
              </div>

              {/* Full Name Section */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <Label className="font-medium text-gray-500">{t('fullName')}</Label>
                  <p className="mt-1 font-medium">{user?.full_name || t('notUpdated')}</p>
                </div>
                <Button variant="outline" onClick={() => setOpenFullNameDialog(true)}>
                  {t('edit')}
                </Button>
              </div>

              {/* Email Section */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <Label className="font-medium text-gray-500">{t('email')}</Label>
                  <p className="mt-1 font-medium">{user?.email || t('notUpdated')}</p>
                </div>
                {!(user?.username === '') && (
                  <Button variant="outline" onClick={() => setOpenEmailDialog(true)}>
                    {t('edit')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* {user?.role === 'user' ? (
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
          </div>
        ) : null} */}
      </div>
      {/* Edit Email Dialog */}
      <EditFieldDialog
        open={openEmailDialog}
        onOpenChange={setOpenEmailDialog}
        title={t('editEmailDialog.title')}
        fieldLabel={t('editEmailDialog.fieldLabel')}
        fieldName="email"
        fieldType="email"
        currentValue={user?.email || ''}
        placeholder={t('editEmailDialog.placeholder')}
        onSubmit={handleUpdateInformation}
        validationSchema={userUpdateSchema.pick({ email: true })}
      />

      {/* Edit Full Name Dialog */}
      <EditFieldDialog
        open={openFullNameDialog}
        onOpenChange={setOpenFullNameDialog}
        title={t('editFullNameDialog.title')}
        fieldLabel={t('editFullNameDialog.fieldLabel')}
        fieldName="full_name"
        currentValue={user?.full_name || ''}
        placeholder={t('editFullNameDialog.placeholder')}
        onSubmit={handleUpdateInformation}
        validationSchema={userUpdateSchema.pick({ full_name: true })}
      />
    </div>
  );
};

export default ProfilePage;
