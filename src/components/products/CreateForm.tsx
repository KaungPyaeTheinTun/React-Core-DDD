import { forwardRef } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import SectionCard from "../ui/SectionCard";
import FormInput from "../ui/FormInput";
import ImageUpload from "../ui/ImageUpload";
import { ChevronDown } from "lucide-react";

interface CategoryOption {
  value: string;
  label: string;
}

interface CreateFormProps {
  cardVariants: Variants;
  productForm: Record<string, unknown>;
  setProductForm: (value: Record<string, unknown>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLoading: boolean;
  resetForm: () => void;
  categoryOptions: CategoryOption[];
  imageFiles: (File | string)[];
  setImageFiles: (files: (File | string)[]) => void;
}

const CreateForm = forwardRef<HTMLDivElement, CreateFormProps>(
  (
    {
      cardVariants,
      productForm,
      setProductForm,
      handleFormSubmit,
      submitLoading,
      resetForm,
      categoryOptions,
      imageFiles,
      setImageFiles,
    },
    ref,
  ) => {
    return (
      <motion.div
        key="create-product-form"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SectionCard title="Add Product">
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Product Name
              </label>
              <FormInput
                placeholder="Wireless Mechanical Keyboard"
                value={(productForm?.name as string) || ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Price ($)
              </label>
              <FormInput
                type="number"
                step="0.01"
                placeholder="29.99"
                value={(productForm?.price as string) ?? ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Quantity
              </label>
              <FormInput
                type="number"
                step="1"
                min="0"
                placeholder="100"
                value={(productForm?.quantity as string) ?? ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, quantity: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Category
              </label>
              <div className="relative">
                <select
                  value={(productForm?.categoryId as string) || ""}
                  onChange={(e) =>
                    setProductForm({ ...productForm, categoryId: e.target.value })
                  }
                  required
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-black outline-none transition focus:border-black disabled:bg-zinc-50 disabled:text-zinc-400"
                >
                  <option value="" disabled>Select category...</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
            <div className="md:col-span-4">
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Description
              </label>
              <textarea
                placeholder="Product description"
                value={(productForm?.description as string) ?? ""}
                onChange={(e) =>
                  setProductForm({ ...productForm, description: e.target.value })
                }
                rows={3}
                required
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-black outline-none transition focus:border-black resize-none"
              />
            </div>
            <div className="md:col-span-4">
              <ImageUpload
                value={imageFiles}
                onChange={setImageFiles}
                label="Product Images"
                name="images"
                maxFiles={10}
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
                {submitLoading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    );
  },
);

export default CreateForm;
