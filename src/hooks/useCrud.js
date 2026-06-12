import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNewCommentToast } from "../utils/toast.jsx";
import { setItems, setLoading, setError, selectEntityState } from "../store/slices/crudSlice";

export function useCrud({
  apiService,
  initialForm,
  mapToPayload,
  mapToForm,
  mapToRow,
  entityName,
}) {
  const dispatch = useDispatch();
  const entityState = useSelector(selectEntityState(entityName));
  const { items, loading, error } = entityState;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      dispatch(setLoading({ entity: entityName, loading: true }));
      dispatch(setError({ entity: entityName, error: null }));

      const response = await apiService.list();

      dispatch(setItems({ entity: entityName, items: response?.data?.items || [] }));
    } catch (err) {
      console.error(err);
      dispatch(setError({ entity: entityName, error: err.message }));
    } finally {
      dispatch(setLoading({ entity: entityName, loading: false }));
    }
  }, [dispatch, apiService, entityName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const resetForm = useCallback(() => {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
  }, [initialForm]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        setSubmitLoading(true);

        const payload = mapToPayload(formData);

        if (editingId) {
          await apiService.update(editingId, payload);
          showNewCommentToast("System", `${entityName} updated successfully.`);
        } else {
          await apiService.create(payload);
          showNewCommentToast("System", `${entityName} created successfully.`);
        }

        await fetchItems();
        resetForm();
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingId, formData, apiService, fetchItems, resetForm, mapToPayload, entityName],
  );

  const handleEditClick = useCallback(
    (row) => {
      const item = items.find((x) => x.id === row.id);

      if (!item) return;

      setEditingId(item.id);
      setFormData(mapToForm(item));
      setShowForm(true);
    },
    [items, mapToForm],
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

    await apiService.remove(targetItem.id);

    showNewCommentToast("System", `${entityName} deleted successfully.`);

    if (editingId === targetItem.id) {
      resetForm();
    }

    setDeleteModalOpen(false);
    setTargetItem(null);

    await fetchItems();
  }, [targetItem, editingId, apiService, fetchItems, resetForm, entityName]);

  const formattedRows = useMemo(() => {
    return items.map(mapToRow);
  }, [items, mapToRow]);

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
  };
}
