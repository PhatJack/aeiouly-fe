'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { ROUTE } from '@/configs/route';
import { fadeInRightVariants } from '@/constants/animations/variants';
import { useAuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useLogoutMutation } from '@/services/auth/logout.api';

import { BrainCircuit, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

import AvatarCustom from '../custom/AvatarCustom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const menuWithImg = [
  { title: 'Trang chủ', icon: '/sidebarIcon/home.png', href: ROUTE.HOME, id: 'home' },
  { title: 'Luyện nói', icon: '/sidebarIcon/microphone.png', href: ROUTE.ONION, id: 'onion' },
  { title: 'Luyện nghe', icon: '/sidebarIcon/headphone.png', href: ROUTE.GYM, id: 'gym' },
  { title: 'Luyện đọc', icon: '/sidebarIcon/reading.png', href: ROUTE.READING, id: 'reading' },
  { title: 'Bảng tin', icon: '/sidebarIcon/newspaper.png', href: ROUTE.NEWS, id: 'news' },
  { title: 'Cài đặt', icon: '/sidebarIcon/cogwheel.png', href: ROUTE.SETTING.INDEX, id: 'setting' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const [state, dispatch] = useAuthContext();
  const [hovered, setHovered] = useState(false);

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Đăng xuất thành công');
        dispatch({ type: 'LOGOUT' });
        router.refresh();
      },
      onError: () => {
        toast.success('Đăng xuất thành công');
        dispatch({ type: 'LOGOUT' });
        router.refresh();
      },
    });
  };

  return (
    <motion.aside
      initial={false} // Prevent initial animation to avoid hydration issues
      animate={{ width: hovered ? '16rem' : '4rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="sticky top-0 flex h-screen min-w-20 flex-col gap-2 overflow-hidden p-4"
    >
      {/* Logo */}
      <Link href={ROUTE.HOME} className="flex items-center space-x-2 p-3">
        <span>
          <BrainCircuit />
        </span>
        {hovered && (
          <motion.span
            variants={fadeInRightVariants}
            initial={'initial'}
            animate={'animate'}
            className="font-semibold"
          >
            Aeiouly
          </motion.span>
        )}
      </Link>

      <Link
        href={ROUTE.TOPIC}
        id="create-topic"
        className="bg-primary hover:bg-primary/80 flex items-center gap-2 rounded-full p-3 text-white"
      >
        <div className="relative size-6 min-w-6">
          <Image fill quality={100} src={'/sidebarIcon/plus.png'} alt={'Plus icon'} />
        </div>
        <motion.span
          initial={false}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : -10,
            pointerEvents: hovered ? 'auto' : 'none',
          }}
          className={cn('text-sm font-medium whitespace-nowrap')}
        >
          Tạo chủ đề
        </motion.span>
      </Link>

      <Separator />

      {/* Menu */}
      <ul className="relative flex flex-col gap-2">
        {menuWithImg.map((item) => (
          <motion.li
            key={item.id}
            id={item.id}
            onClick={() => router.push(item.href)}
            className="hover:bg-secondary/20 relative flex cursor-pointer items-center gap-2 rounded-full p-3 transition-all"
          >
            <div className="relative size-6 min-w-6">
              <Image fill quality={100} src={item.icon} alt={item.title} />
            </div>

            <motion.span
              initial={false}
              animate={{
                opacity: hovered ? 1 : 0,
                x: hovered ? 0 : -10,
                pointerEvents: hovered ? 'auto' : 'none',
              }}
              className={cn(
                'text-sm font-medium whitespace-nowrap text-black',
                pathname === item.href && 'text-secondary-foreground'
              )}
            >
              {item.title}
            </motion.span>

            {pathname === item.href && (
              <motion.div
                className="bg-secondary absolute inset-0 -z-10 rounded-full"
                layoutId="background"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.li>
        ))}
      </ul>

      <div className="flex flex-1 flex-col justify-end gap-4">
        <div
          onClick={handleLogout}
          className="hover:bg-destructive/80 flex w-full cursor-pointer items-center gap-2 rounded-full p-3 transition-all hover:text-white"
        >
          <div className="relative size-6 min-w-6">
            <Image fill quality={100} src={'/sidebarIcon/exit.png'} alt={'Exit icon'} />
          </div>
          <motion.span
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              x: hovered ? 0 : -10,
              pointerEvents: hovered ? 'auto' : 'none',
            }}
            className={cn('text-sm font-medium whitespace-nowrap')}
          >
            Đăng xuất
          </motion.span>
        </div>
        {state.user ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <AvatarCustom className="size-10" url={state.user.avatar_url || '/avatar.gif'} />
            <motion.span
              initial={false}
              animate={{
                opacity: hovered ? 1 : 0,
                x: hovered ? 0 : -10,
                pointerEvents: hovered ? 'auto' : 'none',
              }}
              className={cn('text-sm font-medium whitespace-nowrap')}
            >
              {state.user.full_name}
            </motion.span>
          </div>
        ) : (
          <Button className="h-10 py-2 whitespace-nowrap has-[>svg]:px-2" asChild>
            <Link href={ROUTE.AUTH.LOGIN}>{hovered ? `Đăng nhập` : <LogIn />}</Link>
          </Button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
