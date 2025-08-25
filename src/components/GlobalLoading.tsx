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
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide-brain-circuit"
      >
        <motion.path
          d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path
          d="M9 13a4.5 4.5 0 0 0 3-4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.2,
          }}
        />
        <motion.path
          d="M6.003 5.125A3 3 0 0 0 6.401 6.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.4,
          }}
        />
        <motion.path
          d="M3.477 10.896a4 4 0 0 1 .585-.396"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.6,
          }}
        />
        <motion.path
          d="M6 18a4 4 0 0 1-1.967-.516"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.8,
          }}
        />
        <motion.path
          d="M12 13h4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.path
          d="M12 18h6a2 2 0 0 1 2 2v1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.2,
          }}
        />
        <motion.path
          d="M12 8h8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.4,
          }}
        />
        <motion.path
          d="M16 8V5a2 2 0 0 1 2-2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.6,
          }}
        />
        <motion.circle
          cx="16"
          cy="13"
          r=".5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.3,
          }}
        />
        <motion.circle
          cx="18"
          cy="3"
          r=".5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.6,
          }}
        />
        <motion.circle
          cx="20"
          cy="21"
          r=".5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.9,
          }}
        />
        <motion.circle
          cx="20"
          cy="8"
          r=".5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.2,
          }}
        />
      </motion.svg>
    </div>
  );
};

export default GlobalLoading;
