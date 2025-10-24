'use client';

import AvatarUpload from '@/components/AvatarUpload';
import SettingHeader from '@/components/app/settings/SettingHeader';
import AvatarCustom from '@/components/custom/AvatarCustom';
import { WaveAnimation } from '@/components/shared/WaveAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import { formatTimezoneVN } from '@/lib/timezone';
import { getFallbackInitials } from '@/lib/utils';

import { Calendar, Mail, Pencil, User } from 'lucide-react';

const SettingPage = () => {
  const [state, dispatch] = useAuthContext();

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <SettingHeader
        title="Hồ sơ cá nhân"
        src={'/settingIcon/account.png'}
        description="Quản lý và chỉnh sửa thông tin tài khoản của bạn"
      />

      {/* Profile Card */}
      <div className="rounded-xl border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <AvatarCustom
              url={state.user?.avatar_url || ''}
              className="size-20 border border-slate-200 dark:border-slate-700"
              fallback={getFallbackInitials(state.user?.full_name || '')}
            />
          </div>

          {/* Form Fields */}
          <div className="w-full flex-1 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  {state.user?.full_name}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 flex-1 items-center rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                    {state.user?.email}
                  </div>
                  <Button variant="outline" size="icon" disabled>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  {state.user?.username}
                </div>
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <Label>Ngày tham gia</Label>
                <div className="flex h-10 cursor-not-allowed items-center gap-2 rounded-md border border-slate-200 bg-gray-100 px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <Calendar className="h-4 w-4" />
                  <Input
                    className="w-full border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    // readOnly
                    value={formatTimezoneVN(state.user?.created_at || '')}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-3 border-t pt-4 sm:flex-row dark:border-slate-700">
              <div className="col-start-4">
                <Button className="h-10 w-full flex-1">
                  <Pencil className="h-4 w-4" />
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border p-4">
        <p className="font-semibold">
          Tôi đã <span className="text-primary">mở miệng nói tiếng Anh</span> được
        </p>
        <div className="flex aspect-square size-20 items-center justify-center rounded-full border border-gray-100 bg-gray-50 p-4">
          <p className="text-primary text-5xl font-bold">7</p>
        </div>
        <p className="font-semibold">lần</p>
      </div>
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <div className="relative min-h-44 w-full overflow-hidden rounded-xl border p-4 font-semibold">
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
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
