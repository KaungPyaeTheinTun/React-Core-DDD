import { forwardRef } from "react";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard.jsx";
import FormInput from "../ui/FormInput.jsx";

const CreateForm = forwardRef(
  (
    {
      cardVariants,
      commonTableForm,
      setCommonTableForm,
      handleFormSubmit,
      submitLoading,
      resetForm,
    },
    ref,
  ) => {
    return (
      <motion.div
        key="create-common-table-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard title="Create Common Table Entry">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Type
                </label>
                <FormInput
                  placeholder="CategoryStatus"
                  value={commonTableForm?.type || ""}
                  onChange={(e) =>
                    setCommonTableForm({ ...commonTableForm, type: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Code
                </label>
                <FormInput
                  placeholder="ACTIVE"
                  value={commonTableForm?.code || ""}
                  onChange={(e) =>
                    setCommonTableForm({ ...commonTableForm, code: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Name
                </label>
                <FormInput
                  placeholder="Active"
                  value={commonTableForm?.name || ""}
                  onChange={(e) =>
                    setCommonTableForm({ ...commonTableForm, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
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
                {submitLoading ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default CreateForm;
