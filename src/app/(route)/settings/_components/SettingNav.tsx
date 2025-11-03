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
      <div className="overflow-hidden rounded-2xl bg-white">
        <div className="border-b border-gray-50 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt</h2>
          <p className="text-sm text-gray-500">Quản lý tài khoản và tùy chọn</p>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {menu.map((item) => {
            const isActive = pathname === item.href;

            return (
              <motion.div key={item.title} className="relative">
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                    isActive
                      ? item.danger
                        ? 'bg-red-50 text-red-700'
                        : 'bg-primary/5 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${item.danger && !isActive ? 'hover:bg-red-50 hover:text-red-600' : ''} `}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
                      isActive
                        ? item.danger
                          ? 'bg-red-100 text-red-600'
                          : 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-100/50'
                    } ${item.danger && !isActive ? 'group-hover:bg-red-100 group-hover:text-red-500' : ''} `}
                  >
                    <div className="relative size-5">
                      <Image src={item.icon} alt={item.title} fill quality={100} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate text-sm font-medium">{item.title}</h3>
                      <ChevronRight
                        size={16}
                        className={`opacity-0 transition-transform duration-200 group-hover:opacity-100 ${isActive ? 'rotate-90 opacity-100' : 'group-hover:translate-x-1'} `}
                      />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{item.description}</p>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className={`absolute inset-0 -z-10 rounded-xl ${item.danger ? 'bg-red-50 ring-1 ring-red-200' : 'bg-primary/5 ring-primary/20 ring-1'} `}
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
