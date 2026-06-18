import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  DatabaseZap,
  FileCode2,
  Image,
  Loader2,
  Plus,
  Trash2,
  WandSparkles,
  GripVertical,
  X,
  ListTree,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { moduleGeneratorApi } from "../../api/moduleGeneratorApi";
import FormInput from "../../components/ui/FormInput";
import SectionCard from "../../components/ui/SectionCard";
import { showNewCommentToast } from "../../utils/toast";

interface Field {
  id: string;
  name: string;
  type: string;
  length: string;
  isRequired: boolean;
  isNullable: boolean;
  min: string;
  max: string;
  enumValues: string[];
  useCommonTable: boolean;
}

const fieldTypes = ["string", "int", "decimal", "bool", "DateTime", "enum"];

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
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const createField = (): Field => ({
  id: crypto.randomUUID(),
  name: "",
  type: "string",
  length: "",
  isRequired: false,
  isNullable: false,
  min: "",
  max: "",
  enumValues: [],
  useCommonTable: false,
});

const toggleClass =
  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer select-none has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black";

export default function ModuleGeneratorPage() {
  const [moduleName, setModuleName] = useState("");
  const [runMigration, setRunMigration] = useState(true);
  const [runDbUpdate, setRunDbUpdate] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [fields, setFields] = useState<Field[]>([createField()]);
  const [enableRelation, setEnableRelation] = useState(false);
  const [relatedEntityName, setRelatedEntityName] = useState("");
  const [isPivot, setIsPivot] = useState(false);
  const [deleteBehavior, setDeleteBehavior] = useState("Restrict");
  const [submitting, setSubmitting] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [tablesError, setTablesError] = useState(false);

  useEffect(() => {
    moduleGeneratorApi.getTables().then(setTables).catch(() => setTablesError(true));
  }, []);

  const fieldCount = useMemo(
    () => fields.filter((field) => field.name.trim()).length,
    [fields],
  );

  const updateField = (id: string, patch: Partial<Field>) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...patch } : field,
      ),
    );
  };

  const addField = () => {
    setFields((current) => [...current, createField()]);
  };

  const removeField = (id: string) => {
    setFields((current) =>
      current.length === 1
        ? [createField()]
        : current.filter((field) => field.id !== id),
    );
  };

  const addEnumTag = (id: string, value: string) => {
    const tag = value.trim();
    if (!tag) return;
    setFields((current) =>
      current.map((field) =>
        field.id === id && !field.enumValues.includes(tag)
          ? { ...field, enumValues: [...field.enumValues, tag] }
          : field,
      ),
    );
  };

  const removeEnumTag = (id: string, tag: string) => {
    setFields((current) =>
      current.map((field) =>
        field.id === id
          ? { ...field, enumValues: field.enumValues.filter((t) => t !== tag) }
          : field,
      ),
    );
  };

  const resetForm = () => {
    setModuleName("");
    setRunMigration(true);
    setRunDbUpdate(false);
    setHasImage(false);
    setEnableRelation(false);
    setRelatedEntityName("");
    setIsPivot(false);
    setDeleteBehavior("Restrict");
    setFields([createField()]);
    setTablesError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanModuleName = moduleName.trim();
    const cleanFields = fields
      .map((field) => {
        const trimmed = field.name.trim();
        if (!trimmed) return null;

        const base = {
          name: trimmed,
          type: field.type,
          length:
            field.length === "" || field.length === null
              ? null
              : Number(field.length),
          isRequired: field.isRequired,
          isNullable: field.isNullable,
          useCommonTable: field.useCommonTable,
          isRelation: false,
        };

        if (field.type === "string") {
          return {
            ...base,
            minLength:
              field.min === "" || field.min === null
                ? null
                : Number(field.min),
            maxLength:
              field.max === "" || field.max === null
                ? null
                : Number(field.max),
          };
        }

        if (field.type === "int" || field.type === "decimal") {
          return {
            ...base,
            minValue:
              field.min === "" || field.min === null
                ? null
                : Number(field.min),
            maxValue:
              field.max === "" || field.max === null
                ? null
                : Number(field.max),
          };
        }

        if (field.type === "enum") {
          return {
            ...base,
            enumValues: field.enumValues.join(","),
          };
        }

        return base;
      })
      .filter(Boolean);

    if (!cleanModuleName) {
      toast.error("Module name is required.");
      return;
    }

    if (cleanFields.length === 0) {
      toast.error("Add at least one field.");
      return;
    }

    if (enableRelation && relatedEntityName) {
      cleanFields.push({
        name: relatedEntityName,
        type: "relation",
        length: null,
        isRequired: false,
        isNullable: deleteBehavior === "SetNull",
        useCommonTable: false,
        isRelation: true,
        relatedEntityName,
        isPivot,
        deleteBehavior,
      } as any);
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
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.title ||
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
          title="Module Generator."
          action={
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <FileCode2 className="h-3.5 w-3.5" />
              {fieldCount} Fields
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
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

              <div className="flex flex-wrap gap-2">
                <label className={toggleClass}>
                  <input
                    type="checkbox"
                    checked={runMigration}
                    onChange={(event) => setRunMigration(event.target.checked)}
                    disabled={submitting}
                    className="hidden"
                  />
                  <DatabaseZap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  RunMigration
                </label>
                <label className={toggleClass}>
                  <input
                    type="checkbox"
                    checked={runDbUpdate}
                    onChange={(event) => setRunDbUpdate(event.target.checked)}
                    disabled={submitting}
                    className="hidden"
                  />
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  DataBase Update
                </label>
                <label className={toggleClass}>
                  <input
                    type="checkbox"
                    checked={hasImage}
                    onChange={(event) => setHasImage(event.target.checked)}
                    disabled={submitting}
                    className="hidden"
                  />
                  <Image className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Image Upload
                </label>
              </div>
            </div>

            {/* Fields Designer */}
            <div className="overflow-hidden rounded-xl border border-zinc-200">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex items-center gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    Fields Designer
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        enableRelation ? "bg-black" : "bg-zinc-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={enableRelation}
                        onChange={(e) => setEnableRelation(e.target.checked)}
                        disabled={submitting}
                        className="peer sr-only"
                      />
                      <div
                        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          enableRelation ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Relation</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={addField}
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-lg bg-black px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Add Field</span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {enableRelation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-zinc-200 overflow-hidden"
                  >
                    <div className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-4">
                        <select
                          value={relatedEntityName}
                          onChange={(e) => setRelatedEntityName(e.target.value)}
                          disabled={submitting}
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-black outline-none transition focus:border-black disabled:bg-zinc-50"
                        >
                          <option value="">Select table...</option>
                          {tables.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {tablesError && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Data unavailable
                          </span>
                        )}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className={`relative h-5 w-9 rounded-full transition-colors ${isPivot ? "bg-black" : "bg-zinc-200"}`}>
                            <input
                              type="checkbox"
                              checked={isPivot}
                              onChange={(e) => setIsPivot(e.target.checked)}
                              disabled={submitting}
                              className="peer sr-only"
                            />
                            <div className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isPivot ? "translate-x-4" : "translate-x-0"}`} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Pivot</span>
                        </label>
                        <div className="flex items-center gap-1">
                          {["Cascade", "Restrict", "SetNull"].map((b) => (
                            <label
                              key={b}
                              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                                deleteBehavior === b
                                  ? "border-black bg-black text-white"
                                  : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="delete-behavior"
                                checked={deleteBehavior === b}
                                onChange={() => setDeleteBehavior(b)}
                                disabled={submitting}
                                className="sr-only"
                              />
                              {b === "SetNull" ? "Set Null" : b}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-300">
                    <GripVertical className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                    No fields defined
                  </p>
                  <p className="text-xs text-zinc-400">
                    Click "Add Field" to start building your schema.
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left">
                      <thead>
                        <tr className="bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          <th className="px-4 py-3 w-[180px]">Name</th>
                          <th className="px-4 py-3 w-[150px]">Type</th>
                          <th className="px-4 py-3 w-[110px]">Size</th>
                          <th className="px-4 py-3 text-center w-[60px]">Req</th>
                          <th className="px-4 py-3 text-center w-[60px]">Null</th>
                          <th className="px-4 py-3 text-center w-[60px]">CT</th>
                          <th className="px-4 py-3 w-[125px]">Min</th>
                          <th className="px-4 py-3 w-[125px]">Max</th>
                          <th className="px-4 py-3 text-right w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fields.map((field, index) => {
                          const supportsRange =
                            field.type === "string" ||
                            field.type === "int" ||
                            field.type === "decimal";
                          const isNumeric =
                            field.type === "int" || field.type === "decimal";
                          const isEnum = field.type === "enum";
                          const noSize =
                            field.type === "bool" ||
                            field.type === "DateTime" ||
                            field.type === "enum";

                          return [
                            <tr
                              key={`${field.id}-main`}
                              className="border-t border-zinc-100 transition hover:bg-zinc-50/60"
                            >
                              <td className="px-4 py-2.5">
                                <FormInput
                                  value={field.name}
                                  onChange={(event) =>
                                    updateField(field.id, {
                                      name: event.target.value,
                                    })
                                  }
                                  placeholder={`field_${index + 1}`}
                                  disabled={submitting}
                                  className="py-2 text-sm"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                <select
                                  value={field.type}
                                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                    const newType = event.target.value;
                                    const patch: Partial<Field> = { type: newType };
                                    if (newType === "bool" || newType === "DateTime" || newType === "enum") {
                                      patch.min = "";
                                      patch.max = "";
                                    }
                                    if (newType !== "enum") {
                                      patch.enumValues = [];
                                      patch.useCommonTable = false;
                                    }
                                    updateField(field.id, patch);
                                  }}
                                  disabled={submitting}
                                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-black outline-none transition focus:border-black disabled:bg-zinc-50"
                                >
                                  {fieldTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-2.5">
                                <FormInput
                                  type="number"
                                  min="1"
                                  value={field.length}
                                  onChange={(event) =>
                                    updateField(field.id, {
                                      length: event.target.value,
                                    })
                                  }
                                  placeholder={noSize ? "Disable" : "255"}
                                  disabled={submitting || noSize}
                                  className={`py-2 text-sm ${
                                    noSize ? "opacity-30" : ""
                                  }`}
                                />
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <label className="inline-flex cursor-pointer items-center">
                                  <div
                                    className={`relative h-5 w-9 rounded-full transition-colors ${
                                      field.isRequired
                                        ? "bg-black"
                                        : "bg-zinc-200"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={field.isRequired}
                                      onChange={(event) =>
                                        updateField(field.id, {
                                          isRequired: event.target.checked,
                                        })
                                      }
                                      disabled={submitting}
                                      className="peer sr-only"
                                    />
                                    <div
                                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                        field.isRequired
                                          ? "translate-x-4"
                                          : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                                </label>
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <label className="inline-flex cursor-pointer items-center">
                                  <div
                                    className={`relative h-5 w-9 rounded-full transition-colors ${
                                      field.isNullable
                                        ? "bg-black"
                                        : "bg-zinc-200"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={field.isNullable}
                                      onChange={(event) =>
                                        updateField(field.id, {
                                          isNullable: event.target.checked,
                                        })
                                      }
                                      disabled={submitting}
                                      className="peer sr-only"
                                    />
                                    <div
                                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                        field.isNullable
                                          ? "translate-x-4"
                                          : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                              </label>
                            </td>
                              <td className="px-4 py-2.5 text-center">
                                <label className="inline-flex cursor-pointer items-center">
                                  <div
                                    className={`relative h-5 w-9 rounded-full transition-colors ${
                                      field.useCommonTable
                                        ? "bg-black"
                                        : "bg-zinc-200"
                                    } ${!isEnum ? "opacity-30" : ""}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={field.useCommonTable}
                                      onChange={(event) =>
                                        updateField(field.id, {
                                          useCommonTable: event.target.checked,
                                        })
                                      }
                                      disabled={submitting || !isEnum}
                                      className="peer sr-only"
                                    />
                                    <div
                                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                        field.useCommonTable
                                          ? "translate-x-4"
                                          : "translate-x-0"
                                      }`}
                                    />
                                  </div>
                                </label>
                              </td>
                              {isEnum ? (
                                <td colSpan={2} className="px-4 py-2.5">
                                  <div className="flex flex-wrap gap-1.5 rounded-md border border-zinc-200 px-2 py-1">
                                    {field.enumValues.map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700"
                                      >
                                        {tag}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeEnumTag(field.id, tag)
                                          }
                                          disabled={submitting}
                                          className="ml-0.5 text-zinc-400 hover:text-red-500"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                    <input
                                      type="text"
                                      placeholder="Add value..."
                                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (
                                          e.key === "Enter" ||
                                          e.key === ","
                                        ) {
                                          e.preventDefault();
                                          addEnumTag(field.id, e.currentTarget.value);
                                          e.currentTarget.value = "";
                                        }
                                      }}
                                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                        if (e.currentTarget.value.trim()) {
                                          addEnumTag(field.id, e.currentTarget.value);
                                          e.currentTarget.value = "";
                                        }
                                      }}
                                      disabled={submitting}
                                      className="min-w-[80px] flex-1 border-0 bg-transparent py-0.5 text-xs outline-none placeholder:text-zinc-300"
                                    />
                                  </div>
                                </td>
                              ) : (
                                <>
                                  <td className="px-4 py-2.5">
                                    <FormInput
                                      type="number"
                                      step={isNumeric ? "0.01" : "1"}
                                      value={field.min}
                                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        updateField(field.id, {
                                          min: event.target.value,
                                        })
                                      }
                                      placeholder={
                                        field.type === "string" ? "1" : "0"
                                      }
                                      disabled={submitting || !supportsRange}
                                      className={`py-2 text-sm ${
                                        !supportsRange ? "opacity-30" : ""
                                      }`}
                                    />
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <FormInput
                                      type="number"
                                      step={isNumeric ? "0.01" : "1"}
                                      value={field.max}
                                      onChange={(event) =>
                                        updateField(field.id, {
                                          max: event.target.value,
                                        })
                                      }
                                      placeholder={
                                        field.type === "string" ? "100" : "999"
                                      }
                                      disabled={submitting || !supportsRange}
                                      className={`py-2 text-sm ${
                                        !supportsRange ? "opacity-30" : ""
                                      }`}
                                    />
                                  </td>
                                </>
                              )}
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeField(field.id)}
                                  disabled={submitting}
                                  className="inline-flex rounded-lg p-1.5 text-zinc-300 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed"
                                  title="Remove Field"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ];
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden space-y-2 p-3">
                    {fields.map((field, index) => {
                      const supportsRange =
                        field.type === "string" ||
                        field.type === "int" ||
                        field.type === "decimal";
                      const isNumeric =
                        field.type === "int" || field.type === "decimal";
                      const isEnum = field.type === "enum";
                      const noSize =
                        field.type === "bool" ||
                        field.type === "DateTime" ||
                        field.type === "enum";

                      return (
                        <div
                          key={field.id}
                          className="rounded-xl border border-zinc-200 bg-white overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                              #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeField(field.id)}
                              disabled={submitting}
                              className="rounded-lg p-1 text-zinc-300 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="p-3.5 space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Name</label>
                              <FormInput
                                value={field.name}
                                onChange={(event) =>
                                  updateField(field.id, { name: event.target.value })
                                }
                                placeholder={`field_${index + 1}`}
                                disabled={submitting}
                                className="py-1.5 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Type</label>
                                <select
                                  value={field.type}
                                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                    const newType = event.target.value;
                                    const patch: Partial<Field> = { type: newType };
                                    if (newType === "bool" || newType === "DateTime" || newType === "enum") {
                                      patch.min = "";
                                      patch.max = "";
                                    }
                                    if (newType !== "enum") {
                                      patch.enumValues = [];
                                      patch.useCommonTable = false;
                                    }
                                    updateField(field.id, patch);
                                  }}
                                  disabled={submitting}
                                  className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-black outline-none transition focus:border-black"
                                >
                                  {fieldTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Size</label>
                                <FormInput
                                  type="number"
                                  min="1"
                                  value={field.length}
                                  onChange={(event) =>
                                    updateField(field.id, { length: event.target.value })
                                  }
                                  placeholder={noSize ? "Disable" : "255"}
                                  disabled={submitting || noSize}
                                  className={`py-1.5 text-xs ${noSize ? "opacity-30" : ""}`}
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <div
                                  className={`relative h-5 w-9 rounded-full transition-colors ${
                                    field.isRequired ? "bg-black" : "bg-zinc-200"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={field.isRequired}
                                    onChange={(event) =>
                                      updateField(field.id, { isRequired: event.target.checked })
                                    }
                                    disabled={submitting}
                                    className="peer sr-only"
                                  />
                                  <div
                                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                      field.isRequired ? "translate-x-4" : "translate-x-0"
                                    }`}
                                  />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Required</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <div
                                  className={`relative h-5 w-9 rounded-full transition-colors ${
                                    field.isNullable ? "bg-black" : "bg-zinc-200"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={field.isNullable}
                                    onChange={(event) =>
                                      updateField(field.id, { isNullable: event.target.checked })
                                    }
                                    disabled={submitting}
                                    className="peer sr-only"
                                  />
                                  <div
                                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                      field.isNullable ? "translate-x-4" : "translate-x-0"
                                    }`}
                                  />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Nullable</span>
                              </label>
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <div
                                  className={`relative h-5 w-9 rounded-full transition-colors ${
                                    field.useCommonTable ? "bg-black" : "bg-zinc-200"
                                  } ${!isEnum ? "opacity-30" : ""}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={field.useCommonTable}
                                    onChange={(event) =>
                                      updateField(field.id, { useCommonTable: event.target.checked })
                                    }
                                    disabled={submitting || !isEnum}
                                    className="peer sr-only"
                                  />
                                  <div
                                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                      field.useCommonTable ? "translate-x-4" : "translate-x-0"
                                    }`}
                                  />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">CT</span>
                              </label>
                            </div>

                            {isEnum ? (
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Enum Values</label>
                                <div className="flex flex-wrap gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5">
                                  {field.enumValues.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700"
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeEnumTag(field.id, tag)}
                                        disabled={submitting}
                                        className="text-zinc-400 hover:text-red-500"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))}
                                  <input
                                    type="text"
                                    placeholder="Add value..."
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                      if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        addEnumTag(field.id, e.currentTarget.value);
                                        e.currentTarget.value = "";
                                      }
                                    }}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                      if (e.currentTarget.value.trim()) {
                                        addEnumTag(field.id, e.currentTarget.value);
                                        e.currentTarget.value = "";
                                      }
                                    }}
                                    disabled={submitting}
                                    className="min-w-[60px] flex-1 border-0 bg-transparent py-0.5 text-xs outline-none placeholder:text-zinc-300"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Min</label>
                                  <FormInput
                                    type="number"
                                    step={isNumeric ? "0.01" : "1"}
                                    value={field.min}
                                    onChange={(event) =>
                                      updateField(field.id, { min: event.target.value })
                                    }
                                    placeholder={field.type === "string" ? "1" : "0"}
                                    disabled={submitting || !supportsRange}
                                    className={`py-1.5 text-xs ${!supportsRange ? "opacity-30" : ""}`}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Max</label>
                                  <FormInput
                                    type="number"
                                    step={isNumeric ? "0.01" : "1"}
                                    value={field.max}
                                    onChange={(event) =>
                                      updateField(field.id, { max: event.target.value })
                                    }
                                    placeholder={field.type === "string" ? "100" : "999"}
                                    disabled={submitting || !supportsRange}
                                    className={`py-1.5 text-xs ${!supportsRange ? "opacity-30" : ""}`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
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
