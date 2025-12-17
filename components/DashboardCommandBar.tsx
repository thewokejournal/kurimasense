"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";

export default function DashboardCommandBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        w-full
        sticky
        top-0
        z-40
        px-4
        flex
        items-center
        justify-between
        transition-all
        duration-300
        ${isScrolled 
          ? 'py-2 bg-neutral-950/40 backdrop-blur-xl border-b border-neutral-800/50' 
          : 'py-3 bg-transparent backdrop-blur-md'
        }
      `}
    >
      {/* Left side: Search */}
      <div className={`
        flex items-center gap-3 w-full max-w-sm 
        bg-gradient-to-br from-neutral-900/70 to-neutral-900/50
        backdrop-blur-lg
        border border-neutral-700/40 
        rounded-full px-5 py-3 min-h-[48px] 
        focus-within:border-neutral-600/60 
        focus-within:bg-gradient-to-br focus-within:from-neutral-900/90 focus-within:to-neutral-900/70
        focus-within:shadow-lg focus-within:shadow-neutral-950/40
        transition-all duration-300
        ${isScrolled 
          ? 'shadow-2xl shadow-black/40 scale-[0.98] border-neutral-600/50' 
          : 'shadow-lg shadow-black/25'
        }
      `}>
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
        className={`
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
          hover:from-emerald-400 hover:to-emerald-500
          active:scale-95
          transition-all
          duration-300
          ${isScrolled 
            ? 'shadow-xl shadow-emerald-500/35 scale-[0.98]' 
            : 'shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40'
          }
        `}
      >
        <Plus className="h-4 w-4" />
        Add Field
      </button>
    </div>
  );
}
