import { motion } from "framer-motion";
import SectionCard from "../SectionCard.jsx";
import FormInput from "../FormInput.jsx";

export default function EditForm({
  cardVariants,
  userForm,
  setUserForm,
  handleEditSubmit,
  submitLoading,
  resetForm,
}) {
  return (
    <motion.div
      key="edit-user-form"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SectionCard title="Modify User Profile">
        <form
          onSubmit={handleEditSubmit}
          className="flex flex-col sm:flex-row gap-3 items-end"
        >
          <div className="w-full space-y-1">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
              Full Name
            </label>
            <FormInput
              placeholder="John Doe"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="w-full space-y-1">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
              Email Address
            </label>
            <FormInput
              type="email"
              placeholder="john@example.com"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              required
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="h-11 px-4 rounded-xl border border-zinc-300 font-medium text-zinc-700 hover:bg-zinc-50 uppercase text-xs tracking-wider transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="h-11 px-6 rounded-xl bg-black font-bold text-white hover:bg-zinc-800 disabled:opacity-40 uppercase text-xs tracking-wider transition shrink-0"
            >
              {submitLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </SectionCard>
    </motion.div>
  );
}
