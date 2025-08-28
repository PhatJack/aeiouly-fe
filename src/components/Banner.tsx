import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-secondary/90 via-blue-500/90 to-indigo-600/90 p-6 max-h-64 overflow-hidden shadow-lg">
      {/* Existing background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-indigo-600/20 rounded-2xl" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-lg" />

      <div className="relative flex justify-between items-center h-full">
        <div className="flex flex-col space-y-3 z-10">
          <h2 className="text-4xl font-bold text-white drop-shadow-sm">
            Chào mừng đến với Aeiouly
          </h2>
          <p className="text-white/90 text-sm leading-relaxed max-w-md">
            Giải pháp một cửa cho tất cả nhu cầu của bạn. Khám phá những tính
            năng và khả năng tuyệt vời.
          </p>
          <Button
            type="button"
            size={"lg"}
            className="w-fit"
            variant="secondary"
          >
            Bắt đầu khám phá
          </Button>
        </div>
        <div className="flex justify-center aspect-square relative size-44 right-10 rounded-full">
          <div className="absolute inset-0 bg-gray-50/30 shadow-[0_0_0px_60px_rgba(255,255,255,0.05),0_0_0px_120px_rgba(255,255,255,0.1)] rounded-full"></div>
          <Image
            src="/test.png"
            alt="Aeiouly illustration"
            width={150}
            height={150}
            className="object-cover w-full h-full absolute -bottom-6 z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
