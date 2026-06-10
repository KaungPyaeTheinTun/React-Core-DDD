import { ImagePlus, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function normalizeValue(value, multiple) {
  if (!value) return [];

  const items = Array.isArray(value) ? value : [value];

  return multiple ? items.filter(Boolean) : items.filter(Boolean).slice(0, 1);
}

function getPreviewName(item, index) {
  if (item instanceof File) return item.name;
  if (typeof item === "string") return item.split("/").pop() || `Image ${index + 1}`;
  return item?.name || `Image ${index + 1}`;
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  label = "Image",
  name,
  accept = "image/*",
  required = false,
  disabled = false,
  maxFiles,
  className = "",
}) {
  const inputRef = useRef(null);
  const selectedImages = useMemo(
    () => normalizeValue(value, multiple),
    [value, multiple],
  );
  const [previews, setPreviews] = useState([]);

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
    onChange?.(multiple ? items : items[0] || null);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const nextImages = multiple ? [...selectedImages, ...files] : [files[0]];
    const limitedImages = maxFiles ? nextImages.slice(0, maxFiles) : nextImages;

    emitChange(limitedImages);
    event.target.value = "";
  };

  const removeImage = (index) => {
    emitChange(selectedImages.filter((_, itemIndex) => itemIndex !== index));
  };

  const clearImages = () => {
    emitChange([]);
  };

  const canAddMore =
    !disabled && (!multiple || !maxFiles || selectedImages.length < maxFiles);

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
            Discard {multiple ? "All" : "Image"}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        required={required && selectedImages.length === 0}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!canAddMore}
        className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition hover:border-black hover:bg-white disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-sm">
          {selectedImages.length > 0 ? (
            <ImagePlus className="h-5 w-5" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
        </span>
        <span className="text-sm font-bold text-black">
          {multiple ? "Select images" : "Select image"}
        </span>
        <span className="text-xs font-medium text-zinc-500">
          {multiple
            ? maxFiles
              ? `${selectedImages.length}/${maxFiles} selected`
              : `${selectedImages.length} selected`
            : selectedImages.length
              ? "1 selected"
              : "No image selected"}
        </span>
      </button>

      {previews.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((preview, index) => (
            <div
              key={preview.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="aspect-video overflow-hidden bg-zinc-100">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="min-w-0 truncate text-xs font-bold text-zinc-600">
                  {preview.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-black disabled:cursor-not-allowed disabled:text-zinc-300"
                  title="Discard Image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
