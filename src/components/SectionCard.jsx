export default function SectionCard({ title, children, action }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 max-w-full w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
