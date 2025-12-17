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
        bg-neutral-900/60
        backdrop-blur-md
        border-b border-neutral-700/40
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
            bg-transparent
            outline-none
            text-sm
            text-slate-100
            placeholder:text-neutral-500
          "
        />
      </div>

      {/* Right side: Button */}
      <button
        className="
          bg-emerald-500
          text-slate-900
          text-sm
          px-4
          py-1.5
          rounded-xl
          font-semibold
          hover:bg-emerald-400
          active:bg-emerald-600
          transition
        "
      >
        Add Field
      </button>
    </div>
  );
}
