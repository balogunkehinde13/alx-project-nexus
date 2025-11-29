import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Allow UI overrides
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/10 
        bg-white
        backdrop-blur-sm
        shadow-lg shadow-black/5
        p-5
        transition-all duration-200
        hover:shadow-xl hover:bg-white/10 hover:border-white/20
        cursor-pointer
        ${className || ""}
      `}
    >
      {children}
    </div>
  );
}
