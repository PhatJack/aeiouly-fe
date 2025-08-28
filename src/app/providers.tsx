"use client";
import React from "react";
import { getQueryClient } from "./get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import GlobalLoading from "@/components/GlobalLoading";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/shared/Sidebar";
import { usePathname } from "next/navigation";
import { ROUTE } from "@/configs/route";
import { cn } from "@/lib/utils";

const queryClient = getQueryClient();
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const location = usePathname();
  const excludedPaths = Object.values(ROUTE.AUTH);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextTopLoader color="hsl(150 30% 45%)" zIndex={9999} />
        <TooltipProvider>
          <AuthProvider>
            {!excludedPaths.includes(location) ? <Sidebar /> : null}
            <main
              className={cn(
                "size-full bg-white min-h-screen",
                !excludedPaths.includes(location) ? "px-6 py-5 rounded-l-3xl border" : ""
              )}
            >
              {children}
            </main>
          </AuthProvider>
        </TooltipProvider>
        <Toaster
          position="top-right"
          toastOptions={{}}
          theme={"light"}
          richColors
        />
        <GlobalLoading />
      </QueryClientProvider>
    </>
  );
};

export default Providers;
