"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  loginBodySchema,
  LoginBodySchema,
  useLoginMutation,
} from "@/services/auth/login.api";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

const LoginForm = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false);
  const loginForm = useForm<LoginBodySchema>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = (data: LoginBodySchema) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Đăng nhập thành công!");
        router.push("/", { scroll: false });
      },
      onError: (error) => {
        toast.error((error as any).detail || "Đăng nhập thất bại!");
      },
    });
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmit)}
        className={cn("space-y-6")}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Đăng nhập</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập thông tin bên dưới để đăng nhập vào tài khoản
          </p>
        </div>

        {/* Fields */}
        <div className="grid gap-6">
          {/* Email Field */}
          <FormField
            control={loginForm.control}
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

          {/* Password Field */}
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Mật khẩu</FormLabel>
                  <Link
                    href="/forgot-password"
                    tabIndex={-1}
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isShowPassword ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      size={"icon"}
                      variant={"ghost"}
                      tabIndex={-1}
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent hover:text-primary cursor-pointer"
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
            Đăng nhập
          </Button>

          {/* Divider */}
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-white text-muted-foreground relative z-10 px-2">
              Hoặc tiếp tục với
            </span>
          </div>

          <Button variant="outline" className="w-full" type="button">
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-foreground"
            >
              <title>Google</title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Đăng nhập với Google
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm">
          Không có tài khoản?{" "}
          <Link href={"/register"} className="underline underline-offset-4">
            Đăng ký
          </Link>
        </div>
      </form>
    </Form>
  );
};

export { LoginForm };
