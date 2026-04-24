import { useCallback, useRef, useState } from "react";

interface ComboInputProps {
  suggestions: string[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ComboInput: React.FC<ComboInputProps> = ({
  suggestions,
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered =
    value.length > 0
      ? suggestions
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 10)
      : [];

  const select = useCallback(
    (s: string) => {
      onChange(s);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => value.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-0 top-full z-50 mt-1 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900" style={{ maxHeight: "192px" }}>
          {filtered.map((s, i) => (
            <li
              key={s}
              onMouseDown={(e) => {
                e.preventDefault();
                select(s);
              }}
              className={`cursor-pointer px-4 py-2 text-sm ${
                i === activeIndex
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                  : "text-gray-700 hover:bg-gray-50 dark:text-white/80 dark:hover:bg-gray-800"
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const DESIGNATION_SUGGESTIONS = [
  "CEO",
  "CTO",
  "CFO",
  "COO",
  "CMO",
  "CPO",
  "Founder",
  "Co-Founder",
  "Owner",
  "President",
  "Vice President",
  "VP",
  "Managing Director",
  "Director",
  "Head",
  "Manager",
  "Senior Manager",
  "Engineering Manager",
  "Sales Manager",
  "Marketing Manager",
  "Product Manager",
  "Software Engineer",
  "Senior Software Engineer",
  "Data Analyst",
  "Data Scientist",
  "Operations Manager",
  "Business Development",
  "Account Executive",
  "Account Manager",
];

export default ComboInput;
