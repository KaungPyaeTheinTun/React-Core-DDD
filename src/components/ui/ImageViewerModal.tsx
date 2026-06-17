import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageViewerModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageViewerModal({ images, initialIndex, onClose }: ImageViewerModalProps) {
  const [index, setIndex] = useState(initialIndex || 0);

  if (!images || images.length === 0) return null;

  const current = images[index];
  const hasMultiple = images.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 p-1 text-white/70 hover:text-white transition"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
            <img
              src={current}
              alt={`Image ${index + 1}`}
              className="max-h-[75vh] w-full object-contain"
            />
          </div>

          {/* Navigation */}
          {hasMultiple && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-xs font-bold text-white/70 tracking-wider">
                {index + 1} / {images.length}
              </span>
              <button
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
