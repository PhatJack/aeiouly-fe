import { AuroraBackground } from "@/components/acternity-ui/aurora-background";
import { BrainCircuit, GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh max-h-svh overflow-hidden lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
              <BrainCircuit className="size-5" />
            </div>
            Aeiouly
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <AuroraBackground>
          <div className="">
            <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
              Aeiouly
            </div>
          </div>
        </AuroraBackground>
      </div>
    </div>
  );
}
