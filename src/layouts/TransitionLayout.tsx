"use client";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export const TransitionLayout: IComponent<{ id?: string }> = ({
  children,
  id,
}) => {
  const pathname = usePathname();

  const simplePathname = id ?? pathname?.split("/")[0];

  return (
    <motion.div
      key={simplePathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full z-0"
    >
      {children}
    </motion.div>
  );
};
