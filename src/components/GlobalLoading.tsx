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
        className="size-12 rounded-full bg-gradient-to-tr from-primary to-blue-400"
        animate={{
          borderRadius: ["50%", "40% 60% 70% 30%", "60% 40% 30% 70%", "50%"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default GlobalLoading;
