import { ChevronDown } from "lucide-react";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export default function Select({ options, value, onChange, placeholder = "Select...", disabled = false, error = false, className = "" }: SelectProps) {
  const isUnavailable = error || (options.length === 0 && !disabled);

  return (
    <div className={`relative ${className}`}>
      <select
        value={isUnavailable ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isUnavailable}
        className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-black outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
      >
        {isUnavailable ? (
          <option value="" disabled>
            Data unavailable
          </option>
        ) : placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {!isUnavailable && options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}
