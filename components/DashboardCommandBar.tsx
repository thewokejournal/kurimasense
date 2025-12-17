"use client";

import { Search } from "lucide-react";

export default function DashboardCommandBar() {
  return (
    <div
      className="
        w-full
        sticky
        top-0
        z-40
        bg-white/80
        backdrop-blur-sm
        border-b
        border-neutral-200
        px-4
        py-3
        flex
        items-center
        justify-between
      "
    >
      {/* Left side: Search */}
      <div className="flex items-center gap-2 w-full max-w-sm">
        <Search className="h-4 w-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search fields…"
          className="
            w-full
            bg-transparent
            outline-none
            text-sm
            placeholder:text-neutral-400
          "
        />
      </div>

      {/* Right side: Button */}
      <button
        className="
          bg-green-600
          text-white
          text-sm
          px-4
          py-1.5
          rounded-md
          hover:bg-green-700
          active:bg-green-800
          transition
        "
      >
        Add Field
      </button>
    </div>
  );
}
