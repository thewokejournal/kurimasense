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
        bg-transparent
        backdrop-blur-md
        px-4
        py-3
        flex
        items-center
        justify-between
      "
    >
      {/* Left side: Search */}
      <div className="flex items-center gap-3 w-full max-w-sm bg-neutral-900/60 border border-neutral-800/30 rounded-full shadow-md shadow-black/20 px-5 py-3 min-h-[48px]">
        <Search className="h-4 w-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search fields…"
          className="
            w-full
            bg-transparent
            outline-none
            ring-0
            border-0
            focus:ring-0
            focus:outline-none
            font-sans
            text-[15px]
            text-white
            placeholder:text-neutral-500
            caret-white
          "
        />
      </div>

      {/* Right side: Button */}
      <button
        className="
          bg-neutral-900/70
          border border-neutral-800
          text-neutral-200
          font-sans
          text-[13px]
          tracking-tight
          px-3
          py-1.5
          rounded-lg
          hover:bg-neutral-900/90
          transition
        "
      >
        Add Field
      </button>
    </div>
  );
}
