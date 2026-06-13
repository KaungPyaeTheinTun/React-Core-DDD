export default function RadioGroup({ options, value, onChange, name, className = "" }) {
  return (
    <div className={`flex h-11 items-center gap-4 rounded-lg border border-zinc-200 px-3 ${className}`}>
      {options.map((option) => {
        const label = typeof option === "string" ? option : option.label;
        const val = typeof option === "string" ? option : option.value;
        return (
          <label key={val} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={val}
              checked={value === val}
              onChange={(e) => onChange(e.target.value)}
              className="h-4 w-4 accent-black"
            />
            <span className="text-sm font-medium text-zinc-700">{label}</span>
          </label>
        );
      })}
    </div>
  );
}
