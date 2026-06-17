import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard";

interface EditFormProps {
  cardVariants: Variants;
  userForm: Record<string, unknown>;
  setUserForm: (value: Record<string, unknown>) => void;
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
}

export default function EditForm({
  cardVariants,
  userForm,
  setUserForm,
  handleEditSubmit,
  resetForm,
}: EditFormProps) {
  return (
    <motion.div
      key="edit-user-form"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SectionCard title="Modify User Profile">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            Not available right now.
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-6 h-11 px-8 rounded-xl border border-zinc-200 font-bold text-zinc-600 hover:bg-zinc-50 uppercase text-xs tracking-wider transition"
          >
            Close
          </button>
        </div>
      </SectionCard>
    </motion.div>
  );
}
