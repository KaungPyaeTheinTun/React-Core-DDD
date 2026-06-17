import { forwardRef } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard";
import FormInput from "../ui/FormInput";
import RadioGroup from "../ui/RadioGroup";

interface EditFormProps {
  cardVariants: Variants;
  humanForm: Record<string, unknown>;
  setHumanForm: (value: Record<string, unknown>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLoading: boolean;
  resetForm: () => void;
}

const EditForm = forwardRef<HTMLDivElement, EditFormProps>(
  (
    {
      cardVariants,
      humanForm,
      setHumanForm,
      handleFormSubmit,
      submitLoading,
      resetForm,
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        key="edit-human-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard
          title={
            <div className="flex items-center gap-2.5">
              <span>Modify Human</span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 tracking-wider">
                SystemCode - {humanForm.systemCode as string}
              </span>
            </div>
          }
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Name
                </label>
                <FormInput
                  placeholder="John Doe"
                  value={(humanForm.name as string) ?? ""}
                  onChange={(e) =>
                    setHumanForm({ ...humanForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Age
                </label>
                <FormInput
                  type="number"
                  min="0"
                  placeholder="25"
                  value={(humanForm.age as string) ?? ""}
                  onChange={(e) =>
                    setHumanForm({ ...humanForm, age: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Email
                </label>
                <FormInput
                  type="email"
                  placeholder="john@example.com"
                  value={(humanForm.email as string) ?? ""}
                  onChange={(e) =>
                    setHumanForm({ ...humanForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Gender
                </label>
                <RadioGroup
                  name="gender"
                  options={["Male", "Female", "Other"]}
                  value={(humanForm.gender as string) ?? ""}
                  onChange={(val) => setHumanForm({ ...humanForm, gender: val })}
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
                {submitLoading ? "Updating..." : "Update Human"}
              </button>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default EditForm;
