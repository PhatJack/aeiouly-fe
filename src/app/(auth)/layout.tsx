import Image from 'next/image';
import Link from 'next/link';

import { AuroraBackground } from '@/components/acternity-ui/aurora-background';

import { BrainCircuit } from 'lucide-react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid max-h-svh min-h-svh overflow-hidden p-4 lg:grid-cols-4">
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-1">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
              <BrainCircuit className="size-5" />
            </div>
            Aeiouly
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden overflow-hidden rounded-lg lg:col-span-3 lg:block">
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
