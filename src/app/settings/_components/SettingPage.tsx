'use client';

import SettingHeader from '@/components/app/settings/SettingHeader';
import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Calendar, Check, Crown, Diamond, Mail, Pencil, Sparkles } from 'lucide-react';

const SettingPage = () => {
  // Mock user data - replace with actual user data from your auth context
  const userData = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    avatar: '/path-to-avatar.jpg',
    role: 'Thành Viên Danh Vọng',
    joinDate: 'Gia nhập từ tháng 1, 2024',
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/20">
        <div className="space-y-6 p-4">
          {/* Luxury Header */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/5 via-yellow-500/5 to-amber-600/5 blur-2xl"></div>
            <div className="relative rounded-2xl border border-amber-200/20 bg-white/80 p-6 backdrop-blur-sm dark:border-amber-800/20 dark:bg-slate-900/80">
              <SettingHeader
                title="Hồ Sơ Quý Tộc Đặc Quyền"
                description="Quản lý thông tin cá nhân với phong cách sang trọng và đẳng cấp thượng lưu"
                Icon={Crown}
              />
            </div>
          </div>

          {/* Premium Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Diamond className="h-5 w-5 text-amber-500" />
                <h2 className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-xl font-bold text-transparent">
                  Hồ Sơ Thượng Lưu
                </h2>
                <Sparkles className="h-4 w-4 animate-pulse text-amber-400" />
              </div>
            </div>

            {/* Main Profile Card */}
            <div className="group relative">
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/30 bg-white/60 backdrop-blur-xl dark:border-amber-800/30 dark:bg-slate-900/95">
                {/* Luxury pattern overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-yellow-50/30 dark:from-amber-950/20 dark:via-transparent dark:to-yellow-950/10"></div>

                <div className="relative p-6">
                  <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                    {/* Premium Avatar Section */}
                    <div className="space-y-4 text-center lg:text-left">
                      <div className="group/avatar relative flex justify-center">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 opacity-20 blur transition duration-500 group-hover/avatar:opacity-40"></div>
                        <div className="relative">
                          {/* Crown positioned above avatar */}
                          <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform">
                            <div className="relative">
                              {/* Crown shadow/glow */}
                              <div className="absolute inset-0 scale-110 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-60 blur-sm"></div>
                              {/* Main crown structure */}
                              <div
                                className="relative rounded-t-lg bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-600 p-2"
                                style={{
                                  clipPath:
                                    'polygon(0% 100%, 10% 0%, 25% 60%, 40% 0%, 60% 0%, 75% 60%, 90% 0%, 100% 100%)',
                                }}
                              >
                                <div className="h-6 w-8 rounded-t-lg bg-gradient-to-b from-yellow-300 to-amber-400 opacity-90"></div>
                              </div>
                              {/* Crown jewels */}
                              <div className="absolute top-1 left-1/2 -translate-x-1/2 transform">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></div>
                              </div>
                              <div className="absolute top-2 left-2">
                                <div
                                  className="h-1 w-1 animate-pulse rounded-full bg-blue-500"
                                  style={{ animationDelay: '0.5s' }}
                                ></div>
                              </div>
                              <div className="absolute top-2 right-2">
                                <div
                                  className="h-1 w-1 animate-pulse rounded-full bg-emerald-500"
                                  style={{ animationDelay: '1s' }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Avatar with royal border */}
                          <div className="relative mt-2">
                            <div className="rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 p-1">
                              <div className="rounded-full bg-gradient-to-b from-yellow-200 to-white p-0.5 dark:from-yellow-900 dark:to-slate-800">
                                <AvatarCustom
                                  url={userData.avatar}
                                  className="size-20 border-2 border-amber-200 dark:border-amber-700"
                                  fallback={userData.name}
                                />
                              </div>
                            </div>

                            {/* Royal status indicator */}
                            <div className="absolute -right-1 -bottom-1">
                              <div className="rounded-full border-2 border-white bg-gradient-to-r from-amber-400 to-yellow-500 p-1.5 dark:border-slate-900">
                                <Diamond className="h-3 w-3 animate-pulse text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1 dark:border-amber-800 dark:from-amber-900/50 dark:to-yellow-900/50">
                          <Diamond className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                            {userData.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Premium Form Fields */}
                    <div className="w-full flex-1 space-y-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        {/* Name Field */}
                        <div className="group space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-300"
                          >
                            Tôn Danh Quý Khách
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/10 to-yellow-500/10 opacity-0 transition duration-300 group-hover:opacity-100"></div>
                            <div className="relative flex h-10 items-center rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-all group-hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800/50 dark:group-hover:border-amber-600">
                              {userData.name}
                            </div>
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="group space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-300"
                          >
                            Thư Tín Điện Tử Riêng Tư
                          </Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/10 to-yellow-500/10 opacity-0 transition duration-300 group-hover:opacity-100"></div>
                              <div className="relative flex h-10 w-full items-center rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm transition-all group-hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800/50 dark:group-hover:border-amber-600">
                                {userData.email}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 transition-all duration-300 hover:from-amber-100 hover:to-yellow-100 dark:border-amber-800 dark:from-amber-950 dark:to-yellow-950 dark:hover:from-amber-900 dark:hover:to-yellow-900"
                              disabled
                            >
                              <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {/* Phone Field */}
                        <div className="group space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-300"
                          >
                            Đường Dây Liên Lạc Riêng
                          </Label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/10 to-yellow-500/10 opacity-0 transition duration-300 group-hover:opacity-100"></div>
                              <Input
                                id="phone"
                                defaultValue={userData.phone}
                                className="relative h-10 rounded-lg border-slate-200 bg-white/50 text-sm backdrop-blur-sm transition-all group-hover:border-amber-300 focus:border-amber-400 focus:ring-amber-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:group-hover:border-amber-600"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 border-amber-200 bg-gradient-to-r from-emerald-50 to-green-50 transition-all duration-300 hover:from-emerald-100 hover:to-green-100 dark:border-amber-800 dark:from-emerald-950 dark:to-green-950 dark:hover:from-emerald-900 dark:hover:to-green-900"
                            >
                              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </Button>
                          </div>
                        </div>

                        {/* Join Date Field */}
                        <div className="group space-y-2">
                          <Label className="text-xs font-medium tracking-wide text-slate-600 uppercase dark:text-slate-300">
                            Thành Viên Danh Dự Từ
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/10 to-yellow-500/10 opacity-0 transition duration-300 group-hover:opacity-100"></div>
                            <div className="relative flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-sm backdrop-blur-sm transition-all group-hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800/50 dark:group-hover:border-amber-600">
                              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              <span className="font-medium">{userData.joinDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Premium Actions */}
                      <div className="flex flex-col gap-3 border-t border-amber-100 pt-4 sm:flex-row dark:border-amber-900/50">
                        <Button className="h-10 flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 font-medium text-white transition-all duration-300 hover:scale-[1.01] hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700">
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh Sửa Hồ Sơ Quý Tộc
                        </Button>
                        <Button
                          variant="outline"
                          className="h-10 flex-1 border-amber-200 bg-white/50 font-medium text-amber-700 transition-all duration-300 hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-800/50 dark:text-amber-300 dark:hover:bg-amber-950/50"
                        >
                          <Crown className="mr-2 h-4 w-4" />
                          Cài Đặt Đặc Quyền VIP
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
