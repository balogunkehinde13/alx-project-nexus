import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white">
      {children}
    </div>
  );
}
