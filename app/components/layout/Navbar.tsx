"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="m-6 shadow-sm rounded-full px-6 py-4 flex items-center justify-between bg-white backdrop-blur-sm sticky top-0 z-30">

      {/* Brand */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition"
      >
        PulseVote
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        <Link
          href="/create"
          className="px-4 py-2 rounded-full w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white  shadow-lg hover:shadow-xl transition-all"
        >
          New Poll
        </Link>
      </div>
    </nav>
  );
}
