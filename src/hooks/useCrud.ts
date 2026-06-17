import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNewCommentToast } from "../utils/toast";
import { setItems, setLoading, setError, setPageInfo, selectEntityState } from "../store/slices/crudSlice";
import { api } from "../services/api";
import { BaseApi } from "../api/baseApi";

const API_BASE = (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

interface MediaItem {
  id: string;
  url: string;
  originalName?: string;
}

interface UseCrudConfig<
  TForm = Record<string, unknown>,
  TPayload = Record<string, unknown>,
  TItem extends { id: string } = { id: string } & Record<string, unknown>,
  TRow extends { id: string } = { id: string } & Record<string, unknown>
> {
  apiService: BaseApi;
  initialForm: TForm;
  mapToPayload: (form: TForm) => TPayload;
  mapToForm: (item: TItem) => TForm;
  mapToRow: (item: TItem) => TRow;
  entityName: string;
  mediaEnabled?: boolean;
}

export function useCrud<
  TForm = Record<string, unknown>,
  TPayload = Record<string, unknown>,
  TItem extends { id: string } = { id: string } & Record<string, unknown>,
  TRow extends { id: string } = { id: string } & Record<string, unknown>
>({
  apiService,
  initialForm,
  mapToPayload,
  mapToForm,
  mapToRow,
  entityName,
  mediaEnabled = false,
}: UseCrudConfig<TForm, TPayload, TItem, TRow>) {
  const dispatch = useDispatch();
  const entityState = useSelector(selectEntityState(entityName));
  const { items: rawItems, loading, error, page: storePage, totalCount } = entityState;
  const items = rawItems as TItem[];
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TForm>(initialForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState<TItem | null>(null);

  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [rowImages, setRowImages] = useState<Record<string, (string | null)[]>>({});
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async (targetPage?: number) => {
    const p = targetPage ?? page;
    try {
      dispatch(setLoading({ entity: entityName, loading: true }));
      dispatch(setError({ entity: entityName, error: null }));

      const response = await apiService.list<TItem>(p, pageSize);
      const data = response?.data;

      dispatch(setItems({ entity: entityName, items: data?.items || [] }));
      dispatch(setPageInfo({ entity: entityName, page: p, pageSize, totalCount: data?.totalCount || 0 }));
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error(error);
      dispatch(setError({ entity: entityName, error: error.message || "Unknown error" }));
    } finally {
      dispatch(setLoading({ entity: entityName, loading: false }));
    }
  }, [dispatch, apiService, entityName, page, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const resetForm = useCallback(() => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
    if (mediaEnabled) {
      setImageFiles([]);
      setExistingMedia([]);
    }
  }, [initialForm, mediaEnabled]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setSubmitLoading(true);

        const payload = mapToPayload(formData);
        const images = mediaEnabled
          ? Array.isArray(imageFiles) ? imageFiles : imageFiles ? [imageFiles] : []
          : [];

        const fileList = images.filter((f): f is File => f instanceof File);
        for (const file of fileList) {
          if (file.size > MAX_FILE_SIZE) {
            showNewCommentToast("System", ` File size exceeds the 5 MB limit`);
            setSubmitLoading(false);
            return;
          }
          if (!ALLOWED_TYPES.includes(file.type)) {
            showNewCommentToast("System", `"${file.name}" is not supported. Only JPG, PNG, and WEBP are allowed.`);
            setSubmitLoading(false);
            return;
          }
        }

        if (editingId) {
          const response = await apiService.update(editingId, payload as Record<string, unknown>);
          const apiRes = response as { message?: string; Message?: string };

          if (mediaEnabled) {
            const newFiles = images.filter((f): f is File => f instanceof File);
            const currentUrls = images.filter((f): f is string => typeof f === "string");
            const toDelete = existingMedia.filter(
              (m) => !currentUrls.includes(resolveImageUrl(m.url) ?? ""),
            );

            for (const media of toDelete) {
              await apiService.deleteMedia(editingId, media.id);
            }
            if (newFiles.length > 0) {
              await apiService.uploadMedia(editingId, newFiles);
            }
          }

          showNewCommentToast("System", apiRes.message || apiRes.Message || `${entityName} updated successfully`);
        } else {
          const response = await apiService.create(payload as Record<string, unknown>);
          const apiRes = response as { message?: string; Message?: string; data?: { id?: string } };

          if (mediaEnabled) {
            const newId = apiRes.data?.id;
            if (newId && images.length > 0) {
              const files = images.filter((f): f is File => f instanceof File);
              if (files.length > 0) {
                await apiService.uploadMedia(newId, files);
              }
            }
          }

          showNewCommentToast("System", apiRes.message || apiRes.Message || `${entityName} created successfully`);
        }

        await fetchItems();
        resetForm();
      } catch (err: unknown) {
        const error = err as { response?: { status?: number; data?: { message?: string; title?: string; errors?: Record<string, string[]> } }; message?: string };
        if (error.response?.status === 403) {
          window.location.href = "/unauthorized";
          return;
        }
        const data = error.response?.data;
        let message = data?.message || data?.title || "Operation failed.";
        if (data?.errors) {
          const details = Object.entries(data.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("; ");
          message = details || message;
        }
        showNewCommentToast("System", message);
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingId, formData, apiService, fetchItems, resetForm, mapToPayload, entityName, mediaEnabled, imageFiles, existingMedia],
  );

  const handleEditClick = useCallback(
    async (row: { id: string }) => {
      const item = items.find((x) => x.id === row.id);

      if (!item) return;

      setEditingId(item.id);
      setFormData(mapToForm(item));
      setShowForm(true);

      if (mediaEnabled) {
        setImageFiles([]);
        setExistingMedia([]);
        try {
          const response = await apiService.getMedia(item.id);
          const mediaList = response?.data || [];
          setExistingMedia(mediaList);
          if (mediaList.length > 0) {
            setImageFiles(
              mediaList
                .map((m) => resolveImageUrl(m.url))
                .filter((url): url is string => url !== null)
            );
          }
        } catch {
          // media endpoint may not exist
        }
      }
    },
    [items, mapToForm, mediaEnabled, apiService],
  );

  const openDeleteConfirmation = useCallback(
    (row: { id: string }) => {
      const item = items.find((x) => x.id === row.id);

      if (!item) return;

      setTargetItem(item);
      setDeleteModalOpen(true);
    },
    [items],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!targetItem) return;

    try {
      const response = await apiService.remove(targetItem.id);
      const apiRes = response as { message?: string; Message?: string };

      showNewCommentToast("System", apiRes.message || apiRes.Message || `${entityName} deleted successfully`);

      if (editingId === targetItem.id) {
        resetForm();
      }

      setDeleteModalOpen(false);
      setTargetItem(null);

      await fetchItems();
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 403) {
        window.location.href = "/unauthorized";
        return;
      }
      showNewCommentToast("System", error.response?.data?.message || "Delete failed.");
      setDeleteModalOpen(false);
    }
  }, [targetItem, editingId, apiService, fetchItems, resetForm, entityName]);

  useEffect(() => {
    if (!mediaEnabled) return;

    if (items.length === 0) return;

    let cancelled = false;

    const load = async () => {
      const images: Record<string, (string | null)[]> = {};
      for (const item of items) {
        try {
          const response = await apiService.getMedia(item.id);
          const list = response?.data || [];
          if (list.length > 0) {
            images[item.id] = list.map((m) => resolveImageUrl(m.url));
          }
        } catch {}
      }
      if (!cancelled) setRowImages(images);
    };

    load();
    return () => { cancelled = true; };
  }, [mediaEnabled, items, apiService]);

  const formattedRows = useMemo(() => {
    return items.map((item) => {
      const base = mapToRow(item);
      if (mediaEnabled) {
        const { id, ...rest } = base;
        return { id, imageUrls: rowImages[item.id] || [], ...rest };
      }
      return base;
    });
  }, [items, mapToRow, mediaEnabled, rowImages]);

  const mediaOutput = mediaEnabled
    ? { imageFiles, setImageFiles, existingMedia }
    : {};

  return {
    items: items as unknown[],
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    formData: formData as Record<string, unknown>,
    setFormData: setFormData as React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetItem: targetItem as Record<string, unknown> | null,
    formattedRows: formattedRows as (Record<string, unknown> & { id: string })[],
    fetchItems,
    resetForm,
    handleSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    page: storePage,
    totalCount,
    totalPages,
    handlePageChange,
    ...mediaOutput,
  };
}
