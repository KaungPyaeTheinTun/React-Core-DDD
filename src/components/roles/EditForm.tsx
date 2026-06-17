import { forwardRef } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard";
import FormInput from "../ui/FormInput";

interface EditFormProps {
  cardVariants: Variants;
  roleForm: Record<string, unknown>;
  setRoleForm: (value: Record<string, unknown>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLoading: boolean;
  resetForm: () => void;
}

const EditForm = forwardRef<HTMLDivElement, EditFormProps>(
  (
    {
      cardVariants,
      roleForm,
      setRoleForm,
      handleFormSubmit,
      submitLoading,
      resetForm,
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        key="edit-role-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard title="Edit Role">
          <form onSubmit={handleFormSubmit}>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Role Name
                </label>
                <FormInput
                  placeholder="e.g. Editor"
                  value={(roleForm.name as string) ?? ""}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 px-6 rounded-xl border border-zinc-300 font-medium text-zinc-700 hover:bg-zinc-50 uppercase text-xs tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="h-11 px-6 rounded-xl bg-black font-bold text-white hover:bg-zinc-800 disabled:opacity-40 uppercase text-xs tracking-wider transition"
                >
                  {submitLoading ? "Updating..." : "Update Role"}
                </button>
              </div>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default EditForm;
