'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { ROUTE } from '@/configs/route';
import { useAuthStore } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useLogoutMutation } from '@/services/auth/logout.api';

import {
  BookOpen,
  FileText,
  GraduationCap,
  Headphones,
  Home,
  ListChecks,
  LogIn,
  LogOut,
  Mic,
  PenTool,
  Settings,
  Users,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import AvatarCustom from '../custom/AvatarCustom';
import TooltipCustom from '../custom/TooltipCustom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const menuWithImg = [
  { title: 'Trang chủ', icon: Home, href: ROUTE.HOME, id: 'home', role: 'user' },
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
    href: ROUTE.ONION,
    id: 'onion',
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
    title: 'Cài đặt',
    icon: Settings,
    href: ROUTE.SETTING.INDEX,
    id: 'setting',
    role: 'user',
  },
  {
    title: 'Quản lý người dùng',
    icon: Users,
    href: ROUTE.ADMIN.USER_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'Quản lý bài viết',
    icon: FileText,
    href: ROUTE.ADMIN.POST_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'Quản lý bài học nghe',
    icon: ListChecks,
    href: ROUTE.ADMIN.LISTENING_SESSION_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'Quản lý không gian tự học',
    icon: Wrench,
    href: ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT.INDEX,
    role: 'admin',
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.replace(ROUTE.AUTH.LOGIN);
        router.refresh();
        toast.success('Đăng xuất thành công');
        logout();
      },
      onError: () => {
        router.push(ROUTE.AUTH.LOGIN);
        router.refresh();
        toast.success('Đăng xuất thành công');
        logout();
      },
    });
  };

  return (
    <aside className={cn('sticky top-0 flex h-screen max-w-20 min-w-20 flex-col gap-2 p-4')}>
      {/* Logo */}
      <Link href={ROUTE.HOME} className="flex items-center justify-center">
        <div className="relative size-10 overflow-hidden rounded-full">
          <Image fill quality={100} src={'/logo.png'} sizes="60px" alt={'Aeiouly logo'} />
        </div>
      </Link>

      <Separator className="my-2" />

      {/* Menu */}
      <ul className="relative flex flex-col gap-2">
        {menuWithImg
          .filter((item) => {
            if (!user) return false;
            if (item.role === user.role) return true;
            return false;
          })
          .map((item, index) => (
            <TooltipCustom key={`sidebar-${index}`} content={item.title}>
              <motion.li
                id={item.id}
                onClick={() => router.push(item.href)}
                data-navigation
                className="hover:bg-secondary/20 relative flex cursor-pointer items-center justify-center rounded-full p-3 transition-all"
              >
                <div className="relative flex size-6 min-w-6 items-center justify-center">
                  <item.icon size={24} className={cn(pathname === item.href && 'text-white')} />
                </div>

                {pathname === item.href && (
                  <motion.div
                    className="bg-secondary absolute inset-0 -z-10 rounded-full"
                    layoutId="background"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.li>
            </TooltipCustom>
          ))}
      </ul>

      <div className="flex flex-1 flex-col justify-end gap-4">
        {user ? (
          <>
            <TooltipCustom content="Đăng xuất">
              <div
                onClick={handleLogout}
                className="hover:bg-destructive/80 flex w-full cursor-pointer items-center justify-center rounded-full p-3 transition-all hover:text-white"
              >
                <div className="relative flex size-6 min-w-6 items-center justify-center">
                  <LogOut size={24} />
                </div>
              </div>
            </TooltipCustom>
            <TooltipCustom content={user.full_name}>
              <div className="flex items-center justify-center">
                <AvatarCustom className="size-10" url={user.avatar_url || ''} />
              </div>
            </TooltipCustom>
          </>
        ) : (
          <TooltipCustom content="Đăng nhập">
            <Button className="h-10 p-2" asChild>
              <Link href={ROUTE.AUTH.LOGIN}>
                <LogIn />
              </Link>
            </Button>
          </TooltipCustom>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
