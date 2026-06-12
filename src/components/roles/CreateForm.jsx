import { forwardRef } from "react";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard.jsx";
import FormInput from "../ui/FormInput.jsx";

const CreateForm = forwardRef(
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
        key="create-role-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard title="New Role">
          <form onSubmit={handleFormSubmit}>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Role Name
                </label>
                <FormInput
                  placeholder="e.g. Editor"
                  value={roleForm?.name || ""}
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
                  {submitLoading ? "Saving..." : "Save Role"}
                </button>
              </div>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default CreateForm;
