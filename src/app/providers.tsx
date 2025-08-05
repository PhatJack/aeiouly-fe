"use client";
import React from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProgressProvider
      height="4px"
      color="oklch(64.71% 0.21732 36.839)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default Providers;
