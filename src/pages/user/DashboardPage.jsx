import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-6 max-w-full mx-auto space-y-6 bg-white text-black"
    >
      <div className="py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
          User Dashboard
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Welcome! User features are coming soon.
        </p>
      </div>
    </motion.div>
  );
}
