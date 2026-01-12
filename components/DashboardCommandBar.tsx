"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function DashboardCommandBar() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchNotEmpty = query.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Visibility logic: expand on mobile (sm), collapse on md+ when scrolled and search is empty (unless focused)
  const shouldShowFullSearch = !hasScrolled || searchNotEmpty || isFocused;

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
        ${hasScrolled 
          ? 'py-2 bg-neutral-950/40 backdrop-blur-xl border-b border-neutral-800/50 shadow-md' 
          : 'py-3 bg-transparent backdrop-blur-md'
        }
      `}
    >
      {/* Left side: Search */}
      <div className={`
        surface-soft
        flex items-center gap-3 w-full max-w-sm 
        px-5 py-3 min-h-[48px] 
        rounded-xl
        focus-within:ring-1 focus-within:ring-white/10
        transition-all duration-300 ease-out
        ${hasScrolled 
          ? 'shadow-2xl shadow-black/40 scale-[0.98]' 
          : 'shadow-lg shadow-black/25'
        }
      `}>
        <Search 
          className={`
            h-4 w-4 text-muted
            transition-all duration-300 ease-out
            cursor-pointer
            ${!shouldShowFullSearch ? 'hover:text-neutral-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : ''}
          `} 
        />
        <input
          type="text"
          placeholder="Search fields…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            bg-transparent
            border-none
            outline-none
            ring-0
            focus:ring-0
            focus:outline-none
            font-sans
            text-[15px]
            text-primary
            placeholder:text-muted
            transition-all duration-300 ease-out
            sm:opacity-100 sm:max-w-[16rem]
            ${shouldShowFullSearch 
              ? 'md:opacity-100 md:max-w-[16rem]' 
              : 'md:opacity-0 md:max-w-0 md:pointer-events-none'
            }
          `}
        />
      </div>

      {/* Right side: Button */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => console.log('Add field clicked')}
        >
          <Plus className="h-4 w-4" />
          Add Field
        </button>
      </div>
    </div>
  );
}
