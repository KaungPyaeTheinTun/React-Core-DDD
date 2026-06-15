import { useState } from "react";
import { motion } from "framer-motion";
import ImageViewerModal from "./ImageViewerModal";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|bmp|svg|ico)(\?.*)?$/i;

function isImageUrl(val) {
  return typeof val === "string" && IMAGE_EXT.test(val);
}

const rowVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.03, duration: 0.25, ease: "easeOut" },
  }),
};

export default function DataTable({ columns, rows, renderActions, renderCell }) {
  const hasActions = !!renderActions;
  const [imageViewer, setImageViewer] = useState({ open: false, images: [], index: 0 });

  const openViewer = (images, index) => {
    const list = Array.isArray(images) ? images : [images];
    setImageViewer({ open: true, images: list.filter(Boolean), index });
  };

  function renderValue(v, colIndex, row) {
    if (renderCell) return renderCell(v, colIndex, row);

    if (isImageUrl(v)) {
      return (
        <img
          src={v}
          alt=""
          className="h-10 w-10 rounded-lg object-cover cursor-pointer border border-zinc-200 hover:opacity-80 transition-opacity"
          onClick={() => openViewer(v, 0)}
        />
      );
    }

    if (Array.isArray(v)) {
      const imgs = v.filter(isImageUrl);
      if (imgs.length > 0) {
        return (
          <div className="flex items-center gap-1.5">
            <img
              src={imgs[0]}
              alt=""
              className="h-10 w-10 rounded-lg object-cover cursor-pointer border border-zinc-200 hover:opacity-80 transition-opacity"
              onClick={() => openViewer(imgs, 0)}
            />
            {imgs.length > 1 && (
              <span className="text-[10px] font-bold text-zinc-400">+{imgs.length - 1}</span>
            )}
          </div>
        );
      }
    }

    return v;
  }

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
                      {renderValue(cellValues[index], index, row)}
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
                      {renderValue(v, i - 1, row)}
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

      {imageViewer.open && (
        <ImageViewerModal
          images={imageViewer.images}
          initialIndex={imageViewer.index}
          onClose={() => setImageViewer({ open: false, images: [], index: 0 })}
        />
      )}
    </div>
  );
}
