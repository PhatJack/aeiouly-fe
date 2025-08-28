"use client";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import React from "react";
import CutoutTextLoader from "./Loading";

const GlobalLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  if (!isFetching && !isMutating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <CutoutTextLoader
        height="450px"
        background="white"
        // NOTE: Using GIFs for the background looks super cool :)
        imgUrl="background.gif"
      />
    </div>
  );
};

export default GlobalLoading;
