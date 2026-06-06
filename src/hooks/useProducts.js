import { useState, useEffect, useMemo, useCallback } from "react";
import { productApi } from "../services/api.js";
import { showNewCommentToast } from "../utils/toast.jsx";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productApi.list();
      const actualProducts =
        response?.data || (Array.isArray(response) ? response : []);
      setProducts(actualProducts);
    } catch (err) {
      setError("Failed to sync products list with server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = useCallback(() => {
    setProductForm({ name: "", price: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  }, []);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setSubmitLoading(true);
        const payload = {
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price) || 0,
        };

        if (editingId) {
          await productApi.update(editingId, payload);
          showNewCommentToast("Product ", `Updated: ${payload.name}`);
        } else {
          await productApi.create(payload);
          showNewCommentToast(
            "Product : ",
            `Added new product: ${payload.name}`,
          );
        }
        resetForm();
        fetchProducts();
      } catch (err) {
        const fallbackMsg = editingId
          ? "Failed to update product."
          : "Failed to submit new product.";
        showNewCommentToast(
          "Inventory Error",
          err.response?.data?.message || fallbackMsg,
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingId, productForm, fetchProducts, resetForm],
  );

  const handleEditClick = useCallback(
    (prodRow) => {
      const originalProduct = products.find((p) => p.id === prodRow.id);
      if (!originalProduct) return;
      setEditingId(originalProduct.id);
      setProductForm({
        name: originalProduct.name,
        price: originalProduct.price.toString(),
        description: originalProduct.description || "",
      });
      setShowForm(true);
    },
    [products],
  );

  const openDeleteConfirmation = useCallback(
    (prodRow) => {
      const originalProduct = products.find((p) => p.id === prodRow.id);
      if (!originalProduct) return;
      setTargetProduct(originalProduct);
      setDeleteModalOpen(true);
    },
    [products],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!targetProduct) return;
    try {
      await productApi.remove(targetProduct.id);
      showNewCommentToast("Catalog ", `Removed: ${targetProduct.name}`);
      if (editingId === targetProduct.id) resetForm();
      setDeleteModalOpen(false);
      setTargetProduct(null);
      fetchProducts();
    } catch (err) {
      showNewCommentToast(
        "Inventory Error",
        err.response?.data?.message || "Failed to delete product execution.",
      );
    }
  }, [targetProduct, editingId, fetchProducts, resetForm]);

  // Caches math row layouts to prevent heavy recalculation bottlenecks
  const formattedRows = useMemo(() => {
    return products.map((prod) => ({
      id: prod.id,
      name: prod.name,
      price: `$${prod.price.toFixed(2)}`,
      tax: `$${(prod.tax || 0).toFixed(2)}`,
      priceWithTax: `$${(prod.priceWithTax || 0).toFixed(2)}`,
      description: prod.description || "No description available",
      status: prod.status || "Active",
    }));
  }, [products]);

  return {
    products,
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    productForm,
    setProductForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetProduct,
    formattedRows,
    handleFormSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
  };
}
