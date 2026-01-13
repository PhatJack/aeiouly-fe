'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

import { LoginWithGoogleButton } from '@/components/app/auth/LoginWithGoogleButton';
import { PasswordStrengthMeter } from '@/components/shared/PasswordStrengthMeter';
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
import {
  RegisterBodySchema,
  registerBodySchema,
  useRegisterMutation,
} from '@/services/auth/register.api';
import { zodResolver } from '@hookform/resolvers/zod';

import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const RegisterForm = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const t = useTranslations('auth');

  const registerForm = useForm<RegisterBodySchema>({
    resolver: zodResolver(registerBodySchema),
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      password: '',
    },
  });

  const registerMutate = useRegisterMutation();

  const onSubmit = (data: RegisterBodySchema) => {
    registerMutate.mutate(data, {
      onSuccess: () => {
        toast.success(t(`api.auth.REGISTER_SUCCESSFULLY`));
        router.push(ROUTE.AUTH.LOGIN);
      },
      onError: (error) => {
        toast.error(
          t(`api.auth.${(error as any).detail?.code}`) ||
            (error as any).detail?.message ||
            t('api.auth.REGISTER_FAILED')
        );
      },
    });
  };

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)} className={cn('space-y-4')}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('register.title')}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t('register.description')}</p>
        </div>

        {/* Confirm Password */}
        <FormField
          control={registerForm.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.fullName')}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={registerForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.username')}</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('register.password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={isShowPassword ? 'text' : 'password'} {...field} />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setIsShowPassword((prev) => !prev)}
                    className="text-muted-foreground absolute top-[14%] right-4 -translate-y-1/2"
                  >
                    {isShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  <PasswordStrengthMeter
                    passwordFieldName="password"
                    control={registerForm.control}
                    className="pt-4"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full cursor-pointer">
          {t('register.submit')}
        </Button>

        {/* Divider */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="text-muted-foreground relative z-10 bg-white px-2 dark:bg-[#121212]">
            {t('register.divider')}
          </span>
        </div>

        {/* Google login */}
        <div className="flex w-full justify-center">
          <LoginWithGoogleButton onSuccess={() => router.push(ROUTE.APP)} text="signup_with" />
        </div>

        {/* Footer */}
        <div className="text-center text-sm">
          {t('register.hasAccount')}{' '}
          <Link href={ROUTE.AUTH.LOGIN} className="underline underline-offset-4">
            {t('register.login')}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
