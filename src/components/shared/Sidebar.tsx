'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { ROUTE } from '@/configs/route';
import { useAuthStore } from '@/contexts/AuthContext';
import { useLogoutMutation } from '@/services/auth/logout.api';

import { BrainCircuit, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import AvatarCustom from '../custom/AvatarCustom';
import TooltipCustom from '../custom/TooltipCustom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const menuWithImg = [
  { title: 'Trang chủ', icon: '/sidebarIcon/home.png', href: ROUTE.HOME, id: 'home', role: 'user' },
  {
    title: 'Không gian tự học',
    icon: '/sidebarIcon/space.png',
    href: ROUTE.SPACE,
    id: 'space',
    role: 'user',
  },
  {
    title: 'Luyện nói',
    icon: '/sidebarIcon/microphone.png',
    href: ROUTE.ONION,
    id: 'onion',
    role: 'user',
  },
  {
    title: 'Luyện nghe',
    icon: '/sidebarIcon/headphone.png',
    href: ROUTE.GYM,
    id: 'gym',
    role: 'user',
  },
  {
    title: 'Luyện đọc',
    icon: '/sidebarIcon/reading.png',
    href: ROUTE.READING,
    id: 'reading',
    role: 'user',
  },
  {
    title: 'Bảng tin',
    icon: '/sidebarIcon/newspaper.png',
    href: ROUTE.NEWS,
    id: 'news',
    role: 'user',
  },
  {
    title: 'Cài đặt',
    icon: '/sidebarIcon/cogwheel.png',
    href: ROUTE.SETTING.INDEX,
    id: 'setting',
    role: 'user',
  },
  {
    title: 'Quản lý người dùng',
    icon: '/sidebarIcon/user.png',
    href: ROUTE.ADMIN.USER_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'Quản lý bài viết',
    icon: '/sidebarIcon/post.png',
    href: ROUTE.ADMIN.POST_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'Quản lý bài học nghe',
    icon: '/sidebarIcon/checklist.png',
    href: ROUTE.ADMIN.LISTENING_SESSION_MANAGEMENT,
    role: 'admin',
  },
  {
    title: 'Quản lý không gian tự học',
    icon: '/sidebarIcon/management.png',
    href: ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT,
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
        toast.success('Đăng xuất thành công');
        logout();
        router.refresh();
      },
      onError: () => {
        toast.success('Đăng xuất thành công');
        logout();
        router.refresh();
      },
    });
  };

  return (
    <aside className="sticky top-0 flex h-screen max-w-20 min-w-20 flex-col gap-2 p-4">
      {/* Logo */}
      <TooltipCustom content="Aeiouly">
        <Link href={ROUTE.HOME} className="flex items-center justify-center p-3">
          <BrainCircuit />
        </Link>
      </TooltipCustom>
      {user && user.role === 'user' && (
        <TooltipCustom content="Tạo chủ đề">
          <Link
            href={ROUTE.TOPIC}
            id="create-topic"
            className="bg-primary hover:bg-primary/80 flex items-center justify-center rounded-full p-3 text-white"
          >
            <div className="relative size-6 min-w-6">
              <Image fill quality={100} src={'/sidebarIcon/plus.png'} alt={'Plus icon'} />
            </div>
          </Link>
        </TooltipCustom>
      )}

      <Separator />

      {/* Menu */}
      <ul className="relative flex flex-col gap-2">
        {menuWithImg.map(
          (item, index) =>
            user &&
            (item.role === 'user' || (item.role === 'admin' && user.role === 'admin')) && (
              <TooltipCustom key={`sidebar-${index}`} content={item.title}>
                <motion.li
                  id={item.id}
                  onClick={() => router.push(item.href)}
                  className="hover:bg-secondary/20 relative flex cursor-pointer items-center justify-center rounded-full p-3 transition-all"
                >
                  <div className="relative size-6 min-w-6">
                    <Image fill quality={100} src={item.icon} alt={item.title} />
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
            )
        )}
      </ul>

      <div className="flex flex-1 flex-col justify-end gap-4">
        {user ? (
          <>
            <TooltipCustom content="Đăng xuất">
              <div
                onClick={handleLogout}
                className="hover:bg-destructive/80 flex w-full cursor-pointer items-center justify-center rounded-full p-3 transition-all hover:text-white"
              >
                <div className="relative size-6 min-w-6">
                  <Image fill quality={100} src={'/sidebarIcon/exit.png'} alt={'Exit icon'} />
                </div>
              </div>
            </TooltipCustom>
            <TooltipCustom content={user.full_name}>
              <div className="flex items-center justify-center">
                <AvatarCustom className="size-10" url={user.avatar_url || '/avatar.gif'} />
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
