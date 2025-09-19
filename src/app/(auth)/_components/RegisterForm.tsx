'use client';

import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

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
      onSuccess: (data) => {
        toast.success('Đăng ký thành công!');
        router.push('/login', {});
      },
      onError: (error) => {
        toast.error((error as any).detail || 'Đăng ký thất bại!');
      },
    });
  };

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)} className={cn('space-y-4')}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Tạo tài khoản mới</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập thông tin của bạn bên dưới để đăng ký
          </p>
        </div>

        {/* Confirm Password */}
        <FormField
          control={registerForm.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
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
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Username</FormLabel>
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
              <FormLabel>Mật khẩu</FormLabel>
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
          Đăng ký
        </Button>

        {/* Divider */}
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="text-muted-foreground relative z-10 bg-white px-2">
            Hoặc tiếp tục với
          </span>
        </div>

        {/* Google login */}
        <Button variant="outline" className="w-full" type="button">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-foreground size-4"
          >
            <title>Google</title>
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Tiếp tục với Google
        </Button>

        {/* Footer */}
        <div className="text-center text-sm">
          Đã có tài khoản?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Đăng nhập
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
