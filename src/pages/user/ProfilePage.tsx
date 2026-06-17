import { motion } from "framer-motion";
import SectionCard from "../../components/ui/SectionCard";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export default function ProfilePage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-6 max-w-full mx-auto space-y-6 bg-white text-black"
    >
      <SectionCard title="User Profile">
        <div className="py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Coming soon
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Profile management is not yet available.
          </p>
        </div>
      </SectionCard>
    </motion.div>
  );
}
