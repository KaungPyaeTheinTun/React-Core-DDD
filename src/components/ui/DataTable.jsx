import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.03, duration: 0.25, ease: "easeOut" },
  }),
};

export default function DataTable({ columns, rows, renderActions }) {
  const hasActions = !!renderActions;

  return (
    <div className="w-full">
      {/* Mobile */}
      <div className="block md:hidden space-y-3">
        {rows.map((row, index) => {
          const cellValues = Object.values(row).slice(1);

          return (
            <motion.div
              key={row.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3 shadow-xs"
            >
              <div className="space-y-2">
                {columns.map((colName, index) => (
                  <div
                    key={colName}
                    className="flex items-start justify-between gap-4 text-xs"
                  >
                    <span className="font-bold text-zinc-400 uppercase tracking-wider shrink-0">
                      {colName}:
                    </span>
                    <span className="text-zinc-900 text-right break-words font-medium">
                      {cellValues[index]}
                    </span>
                  </div>
                ))}
              </div>

              {hasActions && (
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Actions:
                  </span>
                  <div>{renderActions(row)}</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider"
                >
                  {c}
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right pr-6">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {rows.map((row, index) => (
              <motion.tr
                key={row.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="hover:bg-zinc-50 transition-colors"
              >
                {Object.values(row).map((v, i) =>
                  i === 0 ? null : (
                    <td
                      key={i}
                      className="px-4 py-3 text-zinc-800 max-w-xs truncate font-medium"
                    >
                      {v}
                    </td>
                  ),
                )}
                {hasActions && (
                  <td className="px-4 py-3 text-right pr-6">
                    {renderActions(row)}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
