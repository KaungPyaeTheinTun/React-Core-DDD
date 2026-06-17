interface RadioGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export default function RadioGroup({ options, value, onChange, name, className = "" }: RadioGroupProps) {
  return (
    <div className={`flex h-11 items-center gap-4 rounded-lg border border-zinc-200 px-3 ${className}`}>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 accent-black"
          />
          <span className="text-sm font-medium text-zinc-700">{option}</span>
        </label>
      ))}
    </div>
  );
}
