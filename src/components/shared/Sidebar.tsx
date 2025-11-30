'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { ROUTE } from '@/configs/route';
import { useAuthStore } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

import {
  BookMarked,
  BookOpen,
  FileText,
  GraduationCap,
  Headphones,
  Home,
  ListChecks,
  LucideIcon,
  Mic,
  PenTool,
  Settings,
  User2,
  Users,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';

const menuWithImg: {
  title: string;
  icon: LucideIcon;
  href: string;
  id?: string;
  role: 'user' | 'admin' | Array<'user' | 'admin'>;
}[] = [
  { title: 'Trang chủ', icon: Home, href: ROUTE.APP, id: 'app', role: 'user' },
  {
    title: 'Không gian tự học',
    icon: GraduationCap,
    href: ROUTE.SPACE,
    id: 'space',
    role: 'user',
  },
  {
    title: 'Luyện nói',
    icon: Mic,
    href: ROUTE.ONION,
    id: 'onion',
    role: 'user',
  },
  {
    title: 'Luyện viết',
    icon: PenTool,
    href: ROUTE.TOPIC,
    id: 'topic',
    role: 'user',
  },
  {
    title: 'Luyện nghe',
    icon: Headphones,
    href: ROUTE.GYM,
    id: 'gym',
    role: 'user',
  },
  {
    title: 'Luyện đọc',
    icon: BookOpen,
    href: ROUTE.READING,
    id: 'reading',
    role: 'user',
  },
  {
    title: 'Từ vựng đã lưu',
    icon: BookMarked,
    href: ROUTE.VOCABULARY,
    id: 'vocabulary',
    role: 'user',
  },
  {
    title: 'Hồ sơ cá nhân',
    icon: User2,
    href: ROUTE.PROFILE,
    id: 'profile',
    role: ['user', 'admin'],
  },
  {
    title: 'QL người dùng',
    icon: Users,
    href: ROUTE.ADMIN.USER_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'QL bài viết',
    icon: FileText,
    href: ROUTE.ADMIN.POST_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'QL bài học nghe',
    icon: ListChecks,
    href: ROUTE.ADMIN.LISTENING_SESSION_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'QL không gian tự học',
    icon: Wrench,
    href: ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT.INDEX,
    role: 'admin',
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    href: ROUTE.SETTING.INDEX,
    id: 'setting',
    role: ['admin', 'user'],
  },
];

interface SidebarProps {
  isExpanded?: boolean;
  handleToggleExpand?: () => void;
}

const Sidebar = ({ isExpanded, handleToggleExpand }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <aside
        id="sidebar"
        className={cn(
          'bg-background fixed top-0 left-0 z-50 flex min-h-full min-w-[72px] flex-col px-3 py-2 transition-[width,translate] duration-300 ease-in-out lg:gap-2',
          isExpanded
            ? 'w-60 max-w-60 translate-x-0'
            : 'w-60 -translate-x-60 lg:w-[72px] lg:translate-x-0'
        )}
      >
        <div className="flex items-center p-1">
          <Link href={ROUTE.HOME} className="flex items-center">
            <div className="relative size-10 overflow-hidden rounded-full">
              <Image
                fill
                quality={100}
                src={'/logo.png'}
                sizes="(max-width: 640px) 100px,200px"
                alt={'Aeiouly logo'}
              />
            </div>
          </Link>
          <motion.span
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            className={cn('text-lg font-medium whitespace-nowrap', isExpanded ? 'block' : 'hidden')}
          >
            Aeiouly
          </motion.span>
        </div>

        {/* Menu */}
        <ul className="relative flex flex-col gap-1">
          {menuWithImg
            .filter((item) => {
              if (!user) return false;
              if (
                typeof item.role === 'string'
                  ? item.role === user.role
                  : item.role.includes(user.role)
              )
                return true;
              return false;
            })
            .map((item, index) => (
              <motion.li
                key={`menu_item_${index}`}
                id={item.id}
                onClick={() => router.push(item.href)}
                data-navigation
                className="hover:bg-primary/20 relative flex w-full cursor-pointer items-center rounded-2xl px-3.5 py-2.5 transition-all"
              >
                <div className="relative flex size-5 min-w-5 items-center justify-center">
                  <item.icon size={20} className={cn(pathname === item.href && 'text-white')} />
                </div>
                <motion.span
                  animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 8 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'text-sm font-medium whitespace-nowrap',
                    pathname === item.href && 'text-secondary-foreground'
                  )}
                >
                  {item.title}
                </motion.span>
                {pathname === item.href && (
                  <motion.div
                    className="bg-primary absolute inset-0 -z-10 rounded-full"
                    layoutId="background"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.li>
            ))}
        </ul>
      </aside>
      <div
        onClick={handleToggleExpand}
        className={cn(
          'fixed inset-0 z-30 block bg-black/50 transition-[display] lg:hidden',
          isExpanded ? 'block' : 'hidden'
        )}
      ></div>
    </>
  );
};

export default Sidebar;
