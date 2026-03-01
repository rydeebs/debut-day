"use client";
import { useMemo, useState } from "react";
import { PLAYER_POOL } from "@/lib/playerPool";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onCommit: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  inputClassName?: string;
}

export default function PlayerInput({
  value,
  onChange,
  onCommit,
  placeholder,
  disabled,
  inputClassName,
}: Props) {
  const [open, setOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    const q = value.toLowerCase();
    return PLAYER_POOL.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [value]);

  function handleSelect(name: string) {
    onChange(name);
    onCommit(name);
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setOpen(false);
            onCommit(value);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={inputClassName}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 top-full mt-0.5 min-w-[180px] bg-[#161b22] border border-[#30363d] rounded-lg shadow-2xl z-50 overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.name}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s.name);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-white/5 text-left transition"
            >
              <span className="text-white text-xs font-medium truncate">{s.name}</span>
              <span className="text-gray-500 text-xs ml-2 shrink-0 font-mono">{s.year}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
