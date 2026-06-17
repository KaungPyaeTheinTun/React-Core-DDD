import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function FormInput({ className = "", ...rest }: FormInputProps) {
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-black font-medium transition text-sm ${className}`}
    />
  );
}
