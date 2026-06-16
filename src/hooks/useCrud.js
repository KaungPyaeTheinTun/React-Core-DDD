import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNewCommentToast } from "../utils/toast.jsx";
import { setItems, setLoading, setError, setPageInfo, selectEntityState } from "../store/slices/crudSlice";
import { api } from "../services/api";

const API_BASE = api.defaults.baseURL.replace(/\/api\/?$/, "");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

export function useCrud({
  apiService,
  initialForm,
  mapToPayload,
  mapToForm,
  mapToRow,
  entityName,
  mediaEnabled = false,
}) {
  const dispatch = useDispatch();
  const entityState = useSelector(selectEntityState(entityName));
  const { items, loading, error, page: storePage, totalCount } = entityState;
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const [imageFiles, setImageFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [rowImages, setRowImages] = useState({});
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async (targetPage) => {
    const p = targetPage ?? page;
    try {
      dispatch(setLoading({ entity: entityName, loading: true }));
      dispatch(setError({ entity: entityName, error: null }));

      const response = await apiService.list(p, pageSize);
      const data = response?.data;

      dispatch(setItems({ entity: entityName, items: data?.items || [] }));
      dispatch(setPageInfo({ entity: entityName, page: p, pageSize, totalCount: data?.totalCount || 0 }));
    } catch (err) {
      console.error(err);
      dispatch(setError({ entity: entityName, error: err.message }));
    } finally {
      dispatch(setLoading({ entity: entityName, loading: false }));
    }
  }, [dispatch, apiService, entityName, page, pageSize]);

  const handlePageChange = useCallback((newPage) => {
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
    async (e) => {
      e.preventDefault();

      try {
        setSubmitLoading(true);

        const payload = mapToPayload(formData);
        const images = mediaEnabled
          ? Array.isArray(imageFiles) ? imageFiles : imageFiles ? [imageFiles] : []
          : [];

        const fileList = images.filter((f) => f instanceof File);
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
          const response = await apiService.update(editingId, payload);

          if (mediaEnabled) {
            const newFiles = images.filter((f) => f instanceof File);
            const currentUrls = images.filter((f) => typeof f === "string");
            const toDelete = existingMedia.filter(
              (m) => !currentUrls.includes(resolveImageUrl(m.url)),
            );

            for (const media of toDelete) {
              await apiService.deleteMedia(editingId, media.id);
            }
            if (newFiles.length > 0) {
              await apiService.uploadMedia(editingId, newFiles);
            }
          }

          const msg = response?.message || response?.Message;
          showNewCommentToast("System", msg || `${entityName} updated successfully`);
        } else {
          const response = await apiService.create(payload);

          if (mediaEnabled) {
            const newId = response?.data?.id;
            if (newId && images.length > 0) {
              const files = images.filter((f) => f instanceof File);
              if (files.length > 0) {
                await apiService.uploadMedia(newId, files);
              }
            }
          }

          const msg = response?.message || response?.Message;
          showNewCommentToast("System", msg || `${entityName} created successfully`);
        }

        await fetchItems();
        resetForm();
      } catch (err) {
        if (err.response?.status === 403) {
          window.location.href = "/unauthorized";
          return;
        }
        const data = err.response?.data;
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
    async (row) => {
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
            setImageFiles(mediaList.map((m) => resolveImageUrl(m.url)));
          }
        } catch {
          // media endpoint may not exist
        }
      }
    },
    [items, mapToForm, mediaEnabled, apiService],
  );

  const openDeleteConfirmation = useCallback(
    (row) => {
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

      const msg = response?.message || response?.Message;
      showNewCommentToast("System", msg || `${entityName} deleted successfully`);

      if (editingId === targetItem.id) {
        resetForm();
      }

      setDeleteModalOpen(false);
      setTargetItem(null);

      await fetchItems();
    } catch (err) {
      if (err.response?.status === 403) {
        window.location.href = "/unauthorized";
        return;
      }
      showNewCommentToast("System", err.response?.data?.message || "Delete failed.");
      setDeleteModalOpen(false);
    }
  }, [targetItem, editingId, apiService, fetchItems, resetForm, entityName]);

  useEffect(() => {
    if (!mediaEnabled) return;

    if (items.length === 0) return;

    let cancelled = false;

    const load = async () => {
      const images = {};
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
    items,
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    formData,
    setFormData,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetItem,
    formattedRows,
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
