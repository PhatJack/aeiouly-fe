"use client";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import React from "react";
import { motion } from "motion/react";

const GlobalLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <motion.div
        className="h-8 w-8 relative"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="absolute inset-0 border-2 border-transparent border-l-primary rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-r-primary rounded-full" />
      </motion.div>
    </div>
  );
};

export default GlobalLoading;
