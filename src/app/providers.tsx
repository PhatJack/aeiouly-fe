"use client";
import React from "react";
import { getQueryClient } from "./get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import GlobalLoading from "@/components/GlobalLoading";
import { useTheme } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = getQueryClient();
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { theme } = useTheme();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextTopLoader color="hsl(150 30% 45%)" zIndex={9999} />
        <AuthProvider>{children}</AuthProvider>
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
