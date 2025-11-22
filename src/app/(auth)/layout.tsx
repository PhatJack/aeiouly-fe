import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid max-h-svh min-h-svh w-full overflow-x-hidden overflow-y-auto bg-white p-4 xl:grid-cols-4 dark:bg-[#121212]">
      <div className="flex flex-col gap-4 p-6 md:p-10 xl:col-span-1">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground relative flex size-16 items-center justify-center overflow-hidden rounded-full">
              <Image src="/logo.png" alt="Aeiouly Logo" fill />
            </div>
            <span className="sr-only">Aeiouly</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden overflow-hidden rounded-lg xl:col-span-3 xl:block">
        <div className="relative size-full">
          <Image
            src={'/banner-auth.png'}
            quality={100}
            priority
            fill
            alt="auth banner"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
