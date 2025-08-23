"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit,
  GraduationCap,
  House,
  LogIn,
  Mic,
  PlusSquare,
  User2,
} from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { ROUTE } from "@/configs/route";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import AvatarCustom from "../custom/AvatarCustom";
import { Button } from "../ui/button";

const menu = [
  { title: "Học tập", icon: <House />, href: ROUTE.HOME },
  { title: "Luyện nói", icon: <Mic />, href: ROUTE.ONION },
  { title: "Gym", icon: <GraduationCap />, href: ROUTE.GYM },
  { title: "Profile", icon: <User2 />, href: ROUTE.PROFILE },
];

const Sidebar = () => {
  const [state, dispatch] = useAuthContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <aside className="h-screen sticky top-0 min-w-20 overflow-hidden p-4 bg-gray-50 flex flex-col gap-4">
        <div className="flex items-center space-x-2 p-2">
          <BrainCircuit />
        </div>
        <Separator />
        <ul className="flex flex-col gap-2 relative">
          {menu.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 relative cursor-pointer p-2 rounded-md hover:bg-gray-200"
            >
              <span className="aspect-square">{item.icon}</span>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  return (
    <motion.aside
      initial={false} // Prevent initial animation to avoid hydration issues
      animate={{ width: isMounted && hovered ? "14rem" : "4rem" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-screen sticky top-0 min-w-16 overflow-hidden p-3 bg-gray-50 dark:bg-gray-800 flex flex-col gap-2"
    >
      {/* Logo */}
      <Link href={ROUTE.HOME} className="flex items-center space-x-2 p-2">
        <span>
          <BrainCircuit />
        </span>
        {isMounted && hovered && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="font-semibold"
          >
            Aeiouly
          </motion.span>
        )}
      </Link>

      <Link href={ROUTE.CREATE} className="flex items-center gap-2 p-2">
        <span>
          <PlusSquare />
        </span>
        {isMounted && hovered && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap"
          >
            Create Topic
          </motion.span>
        )}
      </Link>

      <Separator />

      {/* Menu */}
      <ul className="flex flex-col gap-2 relative">
        {menu.map((item, index) => (
          <motion.li
            key={index}
            onClick={() => setSelectedTab(index)}
            className="flex items-center gap-2 relative cursor-pointer p-2 rounded-md hover:bg-secondary/20 transition-all"
          >
            <Link href={item.href} className="absolute inset-0" />
            <span
              className={cn(
                index === selectedTab && "text-secondary-foreground whitespace-nowrap"
              )}
            >
              {item.icon}
            </span>
            {isMounted && hovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  index === selectedTab && "text-secondary-foreground"
                )}
              >
                {item.title}
              </motion.span>
            )}

            {isMounted && index === selectedTab ? (
              <motion.div
                className="absolute inset-0 bg-secondary rounded-md -z-10"
                layoutId="background"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ) : null}
          </motion.li>
        ))}
      </ul>
      <div className="flex-1 flex flex-col justify-end">
        {state.user ? (
          <div className="flex gap-2">
            <AvatarCustom url={state.user.avatar || ""} />
            <span className="text-sm font-medium">{state.user.full_name}</span>
          </div>
        ) : (
          <Button
            className="has-[>svg]:px-2 py-2 whitespace-nowrap h-10"
            asChild
          >
            <Link href={ROUTE.AUTH.LOGIN}>
              {hovered ? `Đăng nhập` : <LogIn />}
            </Link>
          </Button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
