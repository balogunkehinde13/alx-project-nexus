"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClickAction?: () => void;
  type?: "button" | "submit" | "reset";
};

export default function Button({ children, className, onClickAction, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClickAction}
      className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
