import { ChevronDown } from "lucide-react";

export default function Select({ options, value, onChange, placeholder = "Select...", disabled = false, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-black outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => {
          const label = typeof opt === "string" ? opt : opt.label;
          const val = typeof opt === "string" ? opt : opt.value;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}
