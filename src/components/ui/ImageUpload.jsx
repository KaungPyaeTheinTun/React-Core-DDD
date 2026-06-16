import { AlertCircle, ImagePlus, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function normalizeValue(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function getPreviewName(item, index) {
  if (item instanceof File) return item.name;
  if (typeof item === "string") return item.split("/").pop() || `Image ${index + 1}`;
  return item?.name || `Image ${index + 1}`;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  name,
  accept = "image/*",
  required = false,
  disabled = false,
  maxFiles,
  className = "",
}) {
  const inputRef = useRef(null);
  const selectedImages = useMemo(() => normalizeValue(value), [value]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const objectUrls = [];
    const nextPreviews = selectedImages.map((item, index) => {
      const url = item instanceof File ? URL.createObjectURL(item) : item;
      if (item instanceof File) {
        objectUrls.push(url);
      }
      return {
        id:
          item instanceof File
            ? `${item.name}-${item.size}-${item.lastModified}`
            : `${url}-${index}`,
        name: getPreviewName(item, index),
        url,
      };
    });
    setPreviews(nextPreviews);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const emitChange = (items) => {
    onChange?.(items);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    let hasError = false;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds the 5 MB limit.`);
        hasError = true;
      } else if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not supported. Only JPG, PNG, and WEBP are allowed.`);
        hasError = true;
      }
    }
    if (!hasError) setError("");

    const nextImages = [...selectedImages, ...files];
    const limitedImages = maxFiles ? nextImages.slice(0, maxFiles) : nextImages;
    emitChange(limitedImages);
    event.target.value = "";
  };

  const removeImage = (index) => {
    emitChange(selectedImages.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    emitChange([]);
  };

  const canAddMore = !disabled && (!maxFiles || selectedImages.length < maxFiles);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>

        {selectedImages.length > 0 ? (
          <button
            type="button"
            onClick={clearImages}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:bg-zinc-100 hover:text-black disabled:cursor-not-allowed disabled:text-zinc-300"
          >
            <X className="h-3.5 w-3.5" />
            Discard {maxFiles === 1 ? "Image" : "All"}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={maxFiles !== 1}
        required={required && selectedImages.length === 0}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!canAddMore}
        className="flex items-center gap-3 w-full rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-left transition hover:border-black hover:bg-white disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black shadow-sm">
          {selectedImages.length > 0 ? (
            <ImagePlus className="h-4 w-4" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
        </span>
        <span className="text-sm font-bold text-black">
          {selectedImages.length > 0 ? "Add more" : "Select image"}
        </span>
        <span className="ml-auto text-xs font-medium text-zinc-500">
          {maxFiles
            ? `${selectedImages.length}/${maxFiles}`
            : selectedImages.length
              ? `${selectedImages.length} selected`
              : "No image selected"}
        </span>
      </button>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {previews.map((preview, index) => (
            <div
              key={preview.id}
              className="group relative w-24 overflow-hidden rounded-lg border border-zinc-200 bg-white"
            >
              <div className="aspect-square overflow-hidden bg-zinc-100">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-black group-hover:opacity-100 disabled:cursor-not-allowed"
                title="Discard Image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
