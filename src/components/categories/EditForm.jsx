import { forwardRef } from "react";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard.jsx";
import FormInput from "../ui/FormInput.jsx";

// 2. Wrap your function component inside forwardRef()
const EditForm = forwardRef(({
  cardVariants,
  categoryForm,
  setCategoryForm,
  handleFormSubmit,
  submitLoading,
  resetForm,
}, ref) => { // 3. Add the 'ref' parameter as the second argument here
  return (
    <motion.div
      ref={ref} // 4. Attach the forwarded ref to your outer motion layout node
      key="edit-category-form"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SectionCard title="Modify Catalog Item">
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Category Title
            </label>
            <FormInput
              placeholder="Wireless Mechanical Keyboard"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Unit Price ($)
            </label>
            <FormInput
              type="number"
              step="0.01"
              placeholder="89.99"
              value={categoryForm.price}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, price: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Description
            </label>
            <FormInput
              placeholder="Premium gaming peripherals"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              required
            />
          </div>
          <div className="md:col-span-4 flex justify-end gap-2">
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
              className="w-full md:w-auto h-11 px-6 rounded-xl bg-black font-bold text-white hover:bg-zinc-800 disabled:opacity-40 uppercase text-xs tracking-wider transition"
            >
              {submitLoading ? "Updating..." : "Update Item"}
            </button>
          </div>
        </form>
      </SectionCard>
    </motion.div>
  );
});

// 5. Explicitly export the forwardRef wrapper construct
export default EditForm;