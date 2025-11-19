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
  PanelRightClose,
  PanelRightOpen,
  PenTool,
  Settings,
  User2,
  Users,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';

import TooltipCustom from '../custom/TooltipCustom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

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

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load sidebar state from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    if (saved) {
      setIsExpanded(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sidebar-expanded', JSON.stringify(newState));
  };

  const shouldExpand = isExpanded || hovered;

  return (
    <motion.aside
      initial={false}
      animate={{ width: shouldExpand ? '18rem' : '4rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => !isExpanded && setHovered(true)}
      onMouseLeave={() => !isExpanded && setHovered(false)}
      id="sidebar"
      className={cn('sticky top-0 flex min-h-full min-w-20 flex-col gap-2 p-4')}
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between">
        <Link href={ROUTE.HOME} className="flex items-center">
          <div className="relative size-12 overflow-hidden rounded-full">
            <Image fill quality={100} src={'/logo.png'} sizes="48px" alt={'Aeiouly logo'} />
          </div>
        </Link>
        <TooltipCustom content={isExpanded ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}>
          <Button
            onClick={toggleSidebar}
            variant={'outline'}
            size={'icon'}
            className={"[&_svg:not([class*='size-'])]:size-5"}
            asChild
          >
            <motion.span
              initial={{ opacity: shouldExpand ? 1 : 0 }}
              animate={{ opacity: shouldExpand ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {!isExpanded ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
            </motion.span>
          </Button>
        </TooltipCustom>
      </div>

      <Separator className="my-2" />

      {/* Menu */}
      <ul className="relative flex flex-col gap-2">
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
              className="hover:bg-primary/20 relative flex cursor-pointer items-center gap-3 rounded-full p-3 transition-all"
            >
              <div className="relative flex size-6 min-w-6 items-center justify-center">
                <item.icon size={24} className={cn(pathname === item.href && 'text-white')} />
              </div>
              <motion.span
                animate={{ opacity: shouldExpand ? 1 : 0, x: shouldExpand ? 0 : -10 }}
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
    </motion.aside>
  );
};

export default Sidebar;
