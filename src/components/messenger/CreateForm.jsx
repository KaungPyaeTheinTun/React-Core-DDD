import { forwardRef } from "react";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard.jsx";
import FormInput from "../ui/FormInput.jsx";
import Select from "../ui/Select.jsx";

const CreateForm = forwardRef(
  (
    {
      cardVariants,
      messengerForm,
      setMessengerForm,
      handleFormSubmit,
      submitLoading,
      resetForm,
      statusOptions,
    },
    ref,
  ) => {
    return (
      <motion.div
        key="create-messenger-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard title="Create Messenger Account">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Account Name
                </label>
                <FormInput
                  placeholder="Messenger account name"
                  value={messengerForm?.Name || ""}
                  onChange={(e) =>
                    setMessengerForm({ ...messengerForm, Name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  Status
                </label>
                <Select
                  value={messengerForm?.status || ""}
                  onChange={(val) =>
                    setMessengerForm({ ...messengerForm, status: val })
                  }
                  options={statusOptions}
                  placeholder="Select status"
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
                {submitLoading ? "Saving..." : "Save Account"}
              </button>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default CreateForm;
