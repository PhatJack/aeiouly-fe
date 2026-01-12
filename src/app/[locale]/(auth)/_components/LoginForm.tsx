'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

import { LoginWithGoogleButton } from '@/components/app/auth/LoginWithGoogleButton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTE } from '@/configs/route';
import { cn } from '@/lib/utils';
import { LoginBodySchema, loginBodySchema, useLoginMutation } from '@/services/auth/login.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginForm = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false);
  const t = useTranslations('Auth');

  const loginForm = useForm<LoginBodySchema>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginBodySchema) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        const userInfo = jwtDecode(data.access_token) as any;
        toast.success('Đăng nhập thành công!');
        router.push(userInfo.username === 'admin' ? ROUTE.ADMIN.USER_MANAGEMENT : ROUTE.APP, {
          scroll: false,
        });
      },
      onError: (error) => {
        toast.error((error as any).detail || 'Đăng nhập thất bại!');
      },
    });
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className={cn('space-y-6')}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('login.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t('login.description')}</p>
        </div>

        {/* Fields */}
        <div className="grid gap-4">
          {/* Email Field */}
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.username')}</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>{t('login.password')}</FormLabel>
                  <Link
                    href="/forgot-password"
                    tabIndex={-1}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input type={isShowPassword ? 'text' : 'password'} {...field} />
                    <Button
                      type="button"
                      size={'icon'}
                      variant={'ghost'}
                      tabIndex={-1}
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      className="hover:text-primary absolute top-1/2 right-2 -translate-y-1/2 transform cursor-pointer hover:bg-transparent"
                    >
                      {isShowPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            {t('login.submit')}
          </Button>

          {/* Divider */}
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="text-muted-foreground relative z-10 bg-white px-2 dark:bg-[#121212]">
              {t('login.divider')}
            </span>
          </div>
          <div className="flex w-full justify-center">
            <LoginWithGoogleButton onSuccess={() => router.push(ROUTE.APP)} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm">
          {t('login.noAccount')}{' '}
          <Link href={'/register'} className="underline underline-offset-4">
            {t('login.register')}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export { LoginForm };
