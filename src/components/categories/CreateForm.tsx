import { forwardRef } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard";
import FormInput from "../ui/FormInput";
import ImageUpload from "../ui/ImageUpload";

interface CreateFormProps {
  cardVariants: Variants;
  categoryForm: Record<string, unknown>;
  setCategoryForm: (value: Record<string, unknown>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLoading: boolean;
  resetForm: () => void;
  imageFiles: (File | string)[];
  setImageFiles: (files: (File | string)[]) => void;
}

const CreateForm = forwardRef<HTMLDivElement, CreateFormProps>(
  (
    {
      cardVariants,
      categoryForm,
      setCategoryForm,
      handleFormSubmit,
      submitLoading,
      resetForm,
      imageFiles,
      setImageFiles,
    },
    ref,
  ) => {
    return (
      <motion.div
        key="create-category-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard title="Catalog Provisioning">
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
                value={(categoryForm?.name as string) || ""}
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
                placeholder="9.99"
                value={(categoryForm?.price as string) ?? ""}
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
                value={(categoryForm?.description as string) ?? ""}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="md:col-span-4">
              <ImageUpload
                value={imageFiles}
                onChange={setImageFiles}
                label="Product Image"
                name="image"
                maxFiles={1}
                accept="image/*"
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
                {submitLoading ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default CreateForm;
