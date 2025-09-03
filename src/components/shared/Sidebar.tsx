"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit,
  GraduationCap,
  House,
  LogIn,
  LogOut,
  Mic,
  Newspaper,
  PlusSquare,
} from "lucide-react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { ROUTE } from "@/configs/route";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import AvatarCustom from "../custom/AvatarCustom";
import { Button } from "../ui/button";
import { fadeInRightVariants } from "@/constants/animations/variants";
import { useLogoutMutation } from "@/services/auth/logout.api";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const menu = [
  { title: "Học tập", icon: <House />, href: ROUTE.HOME, id: "home" },
  { title: "Luyện nói", icon: <Mic />, href: ROUTE.ONION, id: "onion" },
  { title: "Gym", icon: <GraduationCap />, href: ROUTE.GYM, id: "gym" },
  { title: "Bảng tin", icon: <Newspaper />, href: ROUTE.NEWS, id: "news" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const [state, dispatch] = useAuthContext();
  const [hovered, setHovered] = useState(false);

  const handleLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
        dispatch({ type: "LOGOUT" });
        router.push(ROUTE.AUTH.LOGIN);
      },
      onError: () => {
        toast.success("Đăng xuất thành công");
        dispatch({ type: "LOGOUT" });
        router.push(ROUTE.AUTH.LOGIN);
      },
    });
  };

  return (
    <motion.aside
      initial={false} // Prevent initial animation to avoid hydration issues
      animate={{ width: hovered ? "16rem" : "4rem" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-screen sticky top-0 min-w-20 overflow-hidden p-4 flex flex-col gap-2"
    >
      {/* Logo */}
      <Link href={ROUTE.HOME} className="flex items-center space-x-2 p-3">
        <span>
          <BrainCircuit />
        </span>
        {hovered && (
          <motion.span
            variants={fadeInRightVariants}
            initial={"initial"}
            animate={"animate"}
            className="font-semibold"
          >
            Aeiouly
          </motion.span>
        )}
      </Link>

      <Link
        href={ROUTE.TOPIC}
        id="create-topic"
        className="flex items-center gap-2 p-3 bg-primary text-white hover:bg-primary/80 rounded-full"
      >
        <span>
          <PlusSquare />
        </span>
        {hovered && (
          <motion.span
            variants={fadeInRightVariants}
            initial={"initial"}
            animate={"animate"}
            className="text-sm font-medium whitespace-nowrap"
          >
            Tạo chủ đề
          </motion.span>
        )}
      </Link>

      <Separator />

      {/* Menu */}
      <ul className="flex flex-col gap-2 relative">
        {menu.map((item, index) => (
          <motion.li
            key={index}
            id={item.id}
            onClick={() => {
              router.push(item.href);
            }}
            className={
              "flex items-center gap-2 relative cursor-pointer p-3 rounded-full hover:bg-secondary/20 transition-all"
            }
          >
            <span
              className={cn(
                pathname === item.href &&
                  "text-secondary-foreground whitespace-nowrap"
              )}
            >
              {item.icon}
            </span>
            {hovered && (
              <motion.span
                variants={fadeInRightVariants}
                initial={"initial"}
                animate={"animate"}
                className={cn(
                  "text-sm font-medium whitespace-nowrap text-black",
                  pathname === item.href && "text-secondary-foreground"
                )}
              >
                {item.title}
              </motion.span>
            )}

            {pathname === item.href ? (
              <motion.div
                className="absolute inset-0 bg-secondary rounded-full -z-10"
                layoutId="background"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ) : null}
          </motion.li>
        ))}
      </ul>
      <div className="flex-1 flex flex-col gap-4 justify-end">
        <div
          onClick={handleLogout}
          className="ư-full flex items-center gap-2 cursor-pointer p-3 rounded-full hover:bg-secondary/20 transition-all"
        >
          <span>
            <LogOut />
          </span>
          {hovered && (
            <motion.span
              variants={fadeInRightVariants}
              initial={"initial"}
              animate={"animate"}
              className="text-sm font-medium whitespace-nowrap"
            >
              Đăng xuất
            </motion.span>
          )}
        </div>
        {state.user ? (
          <Link
            href={`/u/${state.user.username}`}
            className="flex items-center gap-2 overflow-hidden"
          >
            <AvatarCustom
              className="size-12"
              url={state.user.avatar || "/avatar.gif"}
            />
            {hovered && (
              <motion.span
                variants={fadeInRightVariants}
                initial={"initial"}
                animate={"animate"}
                className="text-sm font-medium whitespace-nowrap"
              >
                {state.user.full_name}
              </motion.span>
            )}
          </Link>
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
