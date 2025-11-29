"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClickAction?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  className,
  onClickAction,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClickAction}
      className={`
        px-4 py-2 rounded-xl font-medium
        bg-liner-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
        text-white shadow-sm
        hover:shadow-md
        active:scale-[0.98]
        transition-all
        ${className}
      `}
    >
      {children}
    </button>
  );
}
