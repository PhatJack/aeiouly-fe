'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const menu = [
  {
    title: 'Thông tin cá nhân',
    href: '/settings',
    icon: '/settingIcon/account.png',
    description: 'Quản lý hồ sơ và thông tin cá nhân',
  },
  {
    title: 'Thay đổi mật khẩu',
    href: '/settings/change-password',
    icon: '/settingIcon/lock.png',
    description: 'Cập nhật mật khẩu bảo mật',
  },
  {
    title: 'Chính sách bảo mật',
    href: '/settings/policy',
    icon: '/settingIcon/security.png',
    description: 'Chính sách bảo mật và quyền riêng tư',
  },
  {
    title: 'Điều khoản dịch vụ',
    href: '/settings/terms',
    icon: '/settingIcon/paper.png',
    description: 'Điều khoản và điều kiện sử dụng',
  },
  {
    title: 'Liên hệ',
    href: '/settings/contact',
    icon: '/settingIcon/chat.png',
    description: 'Hỗ trợ khách hàng và phản hồi',
  },
  {
    title: 'Xoá tài khoản',
    href: '/settings/delete-account',
    icon: '/settingIcon/trash-bin.png',
    description: 'Xoá vĩnh viễn tài khoản của bạn',
    danger: true,
  },
];

const SettingNav = () => {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full lg:max-w-md">
      <div className="bg-card overflow-hidden rounded-2xl border shadow-sm transition-all">
        <div className="border-border/50 dark:border-border/30 border-b p-4">
          <h2 className="text-foreground text-xl font-semibold dark:text-white">Cài đặt</h2>
          <p className="text-muted-foreground text-sm dark:text-gray-400">
            Quản lý tài khoản và tùy chọn
          </p>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {menu.map((item) => {
            const isActive = pathname === item.href;

            return (
              <motion.div key={item.title} className="relative">
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl p-2 transition-all duration-200 ${
                    isActive
                      ? item.danger
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                        : 'bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary'
                      : 'text-foreground hover:bg-accent/50 dark:hover:bg-accent/30 dark:text-gray-300'
                  } ${item.danger && !isActive ? 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400' : ''} `}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                      isActive
                        ? item.danger
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                          : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                        : 'bg-muted text-muted-foreground group-hover:bg-muted/70 dark:bg-accent/50 dark:group-hover:bg-accent/70 dark:text-gray-400'
                    } ${item.danger && !isActive ? 'group-hover:bg-red-100 group-hover:text-red-500 dark:group-hover:bg-red-900/30 dark:group-hover:text-red-400' : ''} `}
                  >
                    <div className="relative size-5">
                      <Image src={item.icon} alt={item.title} fill className="object-cover" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-medium">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs dark:text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className={`absolute inset-0 -z-10 rounded-xl ${item.danger ? 'bg-red-50 ring-1 ring-red-200 dark:bg-red-950/50 dark:ring-red-900/50' : 'bg-primary/5 ring-primary/20 dark:bg-primary/10 dark:ring-primary/30 ring-1'} `}
                      initial={false}
                      transition={{
                        type: 'spring',
                        bounce: 0.15,
                        duration: 0.4,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingNav;
