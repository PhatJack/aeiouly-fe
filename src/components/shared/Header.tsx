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
import { WebSocketContext } from '@/contexts/WebsocketContext';
import { getFallbackInitials } from '@/lib/utils';
import { useLogoutMutation } from '@/services/auth/logout.api';

import { LogOut, PanelRightClose, Settings, User2 } from 'lucide-react';
import { toast } from 'sonner';
import { useContextSelector } from 'use-context-selector';

import TooltipCustom from '../custom/TooltipCustom';
import { ModeToggle } from '../mode-toggle';
import HeaderShortcutStreak from './streak/HeaderShortcutStreak';

interface HeaderProps {
  isExpanded: boolean;
  handleToggleExpand: () => void;
}

const Header = ({ isExpanded, handleToggleExpand }: HeaderProps) => {
  const disconnect = useContextSelector(WebSocketContext, (ctx) => ctx?.disconnect);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Đăng xuất thành công');
      disconnect?.();
      router.push(ROUTE.AUTH.LOGIN);
      router.refresh();
    } catch (error) {
      toast.error('Đăng xuất thất bại');
      disconnect?.();
      router.push(ROUTE.AUTH.LOGIN);
      router.refresh();
    }
  };

  return (
    <header className="bg-background/75 sticky top-0 z-50 border-b px-4 py-2 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={isExpanded ? 'default' : 'outline'}
            className="h-10 rounded-full [&_svg:not([class*='size-'])]:size-4"
            onClick={handleToggleExpand}
          >
            {isExpanded ? <PanelRightClose className="rotate-180" /> : <PanelRightClose />}
          </Button>
          <h1 className="text-sm font-semibold sm:text-lg">
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
                  <Button variant="ghost" size={'icon'} className="relative size-10 rounded-full">
                    <AvatarCustom
                      className="size-10"
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
      </div>
    </header>
  );
};

export default Header;
