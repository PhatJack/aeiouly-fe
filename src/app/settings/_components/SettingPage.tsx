'use client';

import SettingHeader from '@/components/app/settings/SettingHeader';
import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Calendar, Check, Mail, Pencil, User } from 'lucide-react';

const SettingPage = () => {
  // Mock user data - replace with actual user data from your auth context
  const userData = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    avatar: '/path-to-avatar.jpg',
    role: 'Thành viên',
    joinDate: 'Gia nhập từ tháng 1, 2024',
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <SettingHeader
        title="Hồ sơ cá nhân"
        Icon={User}
        description="Quản lý và chỉnh sửa thông tin tài khoản của bạn"
      />

      {/* Profile Card */}
      <div className="rounded-xl border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <AvatarCustom
              url={userData.avatar}
              className="size-20 border border-slate-200 dark:border-slate-700"
              fallback={userData.name}
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">{userData.role}</span>
          </div>

          {/* Form Fields */}
          <div className="w-full flex-1 space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  {userData.name}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 flex-1 items-center rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                    {userData.email}
                  </div>
                  <Button variant="outline" size="icon" disabled>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="flex items-center gap-2">
                  <Input id="phone" defaultValue={userData.phone} />
                  <Button variant="outline" size="icon">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <Label>Ngày tham gia</Label>
                <div className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <Calendar className="h-4 w-4" />
                  <span>{userData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row dark:border-slate-700">
              <Button className="h-10 flex-1">
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa hồ sơ
              </Button>
              <Button variant="outline" className="h-10 flex-1">
                Cài đặt tài khoản
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
