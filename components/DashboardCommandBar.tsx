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
      <div className="flex items-center gap-3 w-full max-w-sm">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search fields…"
          className="
            w-full
            bg-neutral-900/50
            border border-neutral-800/60
            rounded-lg
            px-3
            py-1.5
            outline-none
            ring-0
            font-sans
            text-[13px]
            text-neutral-200
            placeholder:text-neutral-500
            tracking-tight
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
