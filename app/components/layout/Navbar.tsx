"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">Project Nexus</Link>

      <div className="flex gap-4">
        <h1>Poll App</h1>
      </div>
    </nav>
  );
}
