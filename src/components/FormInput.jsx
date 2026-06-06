export default function FormInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-black outline-none placeholder:text-zinc-400 focus:border-black font-medium transition text-sm ${props.className || ""}`}
    />
  );
}
