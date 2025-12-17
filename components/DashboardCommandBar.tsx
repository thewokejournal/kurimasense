"use client";

import { Search, Plus } from "lucide-react";

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
      <div className="flex items-center gap-3 w-full max-w-sm bg-neutral-900/60 border border-neutral-800/30 rounded-full shadow-md shadow-black/20 px-5 py-3 min-h-[48px] focus-within:border-neutral-700 focus-within:bg-neutral-900/80 transition-all">
        <Search className="h-4 w-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search fields…"
          className="
            w-full
            bg-transparent
            border-none
            outline-none
            ring-0
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
          flex
          items-center
          gap-2
          bg-gradient-to-br from-emerald-500 to-emerald-600
          text-white
          font-sans
          font-medium
          text-[14px]
          px-5
          py-2.5
          rounded-full
          shadow-lg shadow-emerald-500/25
          hover:shadow-xl hover:shadow-emerald-500/40
          hover:from-emerald-400 hover:to-emerald-500
          active:scale-95
          transition-all
          duration-200
        "
      >
        <Plus className="h-4 w-4" />
        Add Field
      </button>
    </div>
  );
}
