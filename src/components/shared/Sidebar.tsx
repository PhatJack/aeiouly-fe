'use client';

import React from 'react';

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
  Target,
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
    title: 'Lộ trình học tập',
    icon: Target,
    href: ROUTE.STUDY_ROUTE,
    id: 'study-route',
    role: 'user',
  },
  {
    title: 'Không gian tự học',
    icon: GraduationCap,
    href: ROUTE.SPACE,
    id: 'self-study-space',
    role: 'user',
  },
  {
    title: 'Luyện nói',
    icon: Mic,
    href: ROUTE.ONION,
    id: 'speaking-practice',
    role: 'user',
  },
  {
    title: 'Luyện viết',
    icon: PenTool,
    href: ROUTE.TOPIC,
    id: 'writing-practice',
    role: 'user',
  },
  {
    title: 'Luyện nghe',
    icon: Headphones,
    href: ROUTE.GYM,
    id: 'listening-practice',
    role: 'user',
  },
  {
    title: 'Luyện đọc',
    icon: BookOpen,
    href: ROUTE.READING,
    id: 'reading-practice',
    role: 'user',
  },
  {
    title: 'Từ vựng đã lưu',
    icon: BookMarked,
    href: ROUTE.VOCABULARY,
    id: 'saved-vocabulary',
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
    id: 'settings',
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
          'bg-background fixed top-0 left-0 z-100 flex min-h-full min-w-[72px] flex-col px-3 py-2 transition-[width,translate] duration-300 ease-in-out lg:gap-2',
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
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 8 : -10 }}
            transition={{ duration: 0.2 }}
            className={cn('text-lg font-medium whitespace-nowrap', isExpanded ? 'block' : 'hidden')}
          >
            Aeiouly
          </motion.span>
        </div>

        {/* Menu */}
        <ul className="relative mt-4 flex flex-col gap-1 sm:mt-0">
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
                    pathname === item.href && 'text-secondary-foreground',
                    isExpanded ? 'pointer-events-auto' : 'pointer-events-none'
                  )}
                >
                  {item.title}
                </motion.span>
                {pathname === item.href && (
                  <motion.div
                    className="bg-primary absolute inset-0 -z-10 rounded-2xl"
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
          'fixed inset-0 z-60 block bg-black/50 transition-[display] lg:hidden',
          isExpanded ? 'block' : 'hidden'
        )}
      ></div>
    </>
  );
};

export default Sidebar;
