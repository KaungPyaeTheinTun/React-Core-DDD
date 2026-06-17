import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  title?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title = "Confirm Deletion",
}: DeleteModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md transform rounded-xl border border-zinc-200 bg-white p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-black transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-black">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-1 w-full">
            <h3 className="text-base font-bold uppercase tracking-wide text-black">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Are you certain you want to remove{" "}
              <span className="font-bold text-black">"{itemName}"</span>? This
              operation cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:bg-zinc-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 px-5 rounded-xl bg-black text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition"
          >
            Delete Permanently
          </button>
        </div>
      </motion.div>
    </div>
  );
}
