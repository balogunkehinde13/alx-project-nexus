"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 bg-gray-100 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">Project Nexus</Link>

      <div className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
