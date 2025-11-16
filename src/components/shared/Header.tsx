'use client';

import React from 'react';

import { useRouter } from 'nextjs-toploader/app';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTE } from '@/configs/route';
import { useAuthStore } from '@/contexts/AuthContext';
import { getFallbackInitials } from '@/lib/utils';
import { useLogoutMutation } from '@/services/auth/logout.api';

import { LogOut, Settings, User2 } from 'lucide-react';
import { toast } from 'sonner';

import { ModeToggle } from '../mode-toggle';
import HeaderShortcutStreak from './streak/HeaderShortcutStreak';

const Header = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = ROUTE.AUTH.LOGIN;
        toast.success('Đăng xuất thành công');
      },
      onError: () => {
        window.location.href = ROUTE.AUTH.LOGIN;
        toast.success('Đăng xuất thành công');
      },
    });
  };

  if (!user) return null;

  return (
    <header className="bg-background z-50 flex items-center justify-between border-b px-6 py-2">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">
          Xin chào, {user?.full_name || user?.username || 'User'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ModeToggle />
        {user ? (
          <>
            {user.role === 'user' ? <HeaderShortcutStreak /> : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={'icon'} className="relative size-12 rounded-full">
                  <AvatarCustom
                    className="size-12 border"
                    url={user.avatar_url || ''}
                    fallback={getFallbackInitials(user?.full_name || user?.username || 'User')}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">{user.full_name}</p>
                    <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(ROUTE.PROFILE)}>
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(ROUTE.SETTING.INDEX)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
