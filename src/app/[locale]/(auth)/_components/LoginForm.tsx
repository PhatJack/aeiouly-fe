'use client';

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

import { LoginWithGoogleButton } from '@/components/app/auth/LoginWithGoogleButton';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
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
  const t = useTranslations('auth');

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
      onSuccess: (response) => {
        const userInfo = jwtDecode(response.data.access_token) as any;
        toast.success(t(`api.auth.${response.code}`));
        router.push(userInfo.username === 'admin' ? ROUTE.ADMIN.USER_MANAGEMENT : ROUTE.APP, {
          scroll: false,
        });
      },
      onError: (error) => {
        toast.error(
          t(`api.auth.${(error as any).detail?.code}`) ||
            (error as any).detail?.message ||
            'Đăng nhập thất bại!'
        );
      },
    });
  };

  return (
    <form onSubmit={loginForm.handleSubmit(onSubmit)} className={cn('space-y-6')}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t('login.title')}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t('login.description')}</p>
      </div>

      {/* Fields */}
      <div className="grid gap-4">
        {/* Email Field */}
        <Controller
          control={loginForm.control}
          name="username"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-username">{t('login.username')}</FieldLabel>
              <Input
                id="login-username"
                placeholder="johndoe"
                {...field}
                disabled={loginMutation.isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          control={loginForm.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="login-password">{t('login.password')}</FieldLabel>
                <Link
                  href={ROUTE.AUTH.FORGOT_PASSWORD}
                  tabIndex={-1}
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="login-password"
                  disabled={loginMutation.isPending}
                  type={isShowPassword ? 'text' : 'password'}
                  {...field}
                />
                <InputGroupButton
                  size={'icon-sm'}
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
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
        <Link href={ROUTE.AUTH.REGISTER} className="underline underline-offset-4">
          {t('login.register')}
        </Link>
      </div>
    </form>
  );
};

export { LoginForm };
