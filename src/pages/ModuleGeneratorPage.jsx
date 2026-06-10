import { motion } from "framer-motion";
import {
  Check,
  DatabaseZap,
  FileCode2,
  Image,
  Loader2,
  Plus,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { moduleGeneratorApi } from "../api/moduleGeneratorApi.js";
import FormInput from "../components/FormInput.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { showNewCommentToast } from "../utils/toast.jsx";

const fieldTypes = ["string", "int", "decimal", "bool", "DateTime"];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

const createField = () => ({
  id: crypto.randomUUID(),
  name: "",
  type: "string",
  length: "",
  isNullable: false,
});

export default function ModuleGeneratorPage() {
  const [moduleName, setModuleName] = useState("");
  const [runMigration, setRunMigration] = useState(true);
  const [runDbUpdate, setRunDbUpdate] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [fields, setFields] = useState([createField()]);
  const [submitting, setSubmitting] = useState(false);

  const fieldCount = useMemo(
    () => fields.filter((field) => field.name.trim()).length,
    [fields],
  );

  const updateField = (id, patch) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...patch } : field,
      ),
    );
  };

  const addField = () => {
    setFields((current) => [...current, createField()]);
  };

  const removeField = (id) => {
    setFields((current) =>
      current.length === 1
        ? [createField()]
        : current.filter((field) => field.id !== id),
    );
  };

  const resetForm = () => {
    setModuleName("");
    setRunMigration(true);
    setRunDbUpdate(false);
    setHasImage(false);
    setFields([createField()]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanModuleName = moduleName.trim();
    const cleanFields = fields
      .map((field) => ({
        name: field.name.trim(),
        type: field.type,
        length:
          field.length === "" || field.length === null
            ? null
            : Number(field.length),
        isNullable: field.isNullable,
      }))
      .filter((field) => field.name);

    if (!cleanModuleName) {
      toast.error("Module name is required.");
      return;
    }

    if (cleanFields.length === 0) {
      toast.error("Add at least one field.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await moduleGeneratorApi.generate({
        moduleName: cleanModuleName,
        runMigration,
        runDbUpdate,
        hasImage,
        fields: cleanFields,
      });

      showNewCommentToast(
        "System",
        response?.message || `${cleanModuleName} module generated successfully.`,
      );
      resetForm();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Module generation failed.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-full space-y-6 bg-white p-4 text-black md:p-6"
    >
      <motion.div variants={cardVariants}>
        <SectionCard
          title="Module Designer"
          action={
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <FileCode2 className="h-3.5 w-3.5" />
              {fieldCount} Fields
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
              <div className="space-y-2">
                <label
                  htmlFor="module-name"
                  className="text-xs font-bold uppercase tracking-wider text-zinc-500"
                >
                  Module Name
                </label>
                <FormInput
                  id="module-name"
                  value={moduleName}
                  onChange={(event) => setModuleName(event.target.value)}
                  placeholder="Product"
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <label className="flex min-h-12 items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
                  <input
                    type="checkbox"
                    checked={runMigration}
                    onChange={(event) => setRunMigration(event.target.checked)}
                    disabled={submitting}
                    className="h-4 w-4 accent-black"
                  />
                  <DatabaseZap className="h-4 w-4 text-zinc-500" />
                  Run Migration
                </label>

                <label className="flex min-h-12 items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
                  <input
                    type="checkbox"
                    checked={runDbUpdate}
                    onChange={(event) => setRunDbUpdate(event.target.checked)}
                    disabled={submitting}
                    className="h-4 w-4 accent-black"
                  />
                  <Check className="h-4 w-4 text-zinc-500" />
                  Run Database Update
                </label>

                <label className="flex min-h-12 items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50">
                  <input
                    type="checkbox"
                    checked={hasImage}
                    onChange={(event) => setHasImage(event.target.checked)}
                    disabled={submitting}
                    className="h-4 w-4 accent-black"
                  />
                  <Image className="h-4 w-4 text-zinc-500" />
                  Image Support
                </label>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                  Fields Designer
                </h3>
                <button
                  type="button"
                  onClick={addField}
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Field
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      <th className="w-[32%] px-4 py-3">Name</th>
                      <th className="w-[22%] px-4 py-3">Type</th>
                      <th className="w-[18%] px-4 py-3">Length</th>
                      <th className="w-[18%] px-4 py-3">Nullable</th>
                      <th className="w-[10%] px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field) => (
                      <tr
                        key={field.id}
                        className="border-b border-zinc-100 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <FormInput
                            value={field.name}
                            onChange={(event) =>
                              updateField(field.id, {
                                name: event.target.value,
                              })
                            }
                            placeholder="Name"
                            disabled={submitting}
                            className="py-2.5"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={field.type}
                            onChange={(event) =>
                              updateField(field.id, {
                                type: event.target.value,
                              })
                            }
                            disabled={submitting}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-black outline-none transition focus:border-black disabled:bg-zinc-50"
                          >
                            {fieldTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <FormInput
                            type="number"
                            min="1"
                            value={field.length}
                            onChange={(event) =>
                              updateField(field.id, {
                                length: event.target.value,
                              })
                            }
                            placeholder="255"
                            disabled={submitting}
                            className="py-2.5"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <label className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600">
                            <input
                              type="checkbox"
                              checked={field.isNullable}
                              onChange={(event) =>
                                updateField(field.id, {
                                  isNullable: event.target.checked,
                                })
                              }
                              disabled={submitting}
                              className="h-4 w-4 accent-black"
                            />
                            Nullable
                          </label>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => removeField(field.id)}
                            disabled={submitting}
                            className="inline-flex rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-black disabled:cursor-not-allowed disabled:text-zinc-300"
                            title="Remove Field"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600 transition hover:bg-zinc-50 hover:text-black disabled:cursor-not-allowed disabled:text-zinc-300"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <WandSparkles className="h-4 w-4" />
                )}
                Generate Module
              </button>
            </div>
          </form>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
