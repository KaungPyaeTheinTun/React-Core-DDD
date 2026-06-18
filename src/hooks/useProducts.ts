import { useCallback, useState } from "react";
import { useCrud } from "./useCrud";
import { productApi } from "../api/productApi";
import { categoryApi } from "../api/categoryApi";

interface CategoryOption {
  value: string;
  label: string;
}

interface ProductForm {
  name: string;
  price: string;
  description: string;
  quantity: string;
  categoryId: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  categoryId: string;
  categoryName: string;
}

interface ProductPayload {
  Name: string;
  Price: number;
  Description: string;
  Quantity: number;
  CategoryId: string;
}

interface ProductRow {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  quantity: number;
  description: string;
}

export function useProducts() {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  const fetchCategoryOptions = useCallback(async () => {
    try {
      const response = await categoryApi.list(1, 999);
      const items = response?.data?.items ?? [];
      setCategoryOptions(
        items.map((item) => ({
          value: (item as Record<string, unknown>).id as string,
          label: (item as Record<string, unknown>).name as string,
        })),
      );
    } catch {
      setCategoryOptions([]);
    }
  }, []);

  const crud = useCrud<ProductForm, ProductPayload, ProductItem, ProductRow>({
    apiService: productApi,
    entityName: "products",
    mediaEnabled: true,
    initialForm: {
      name: "",
      price: "",
      description: "",
      quantity: "",
      categoryId: "",
    },
    mapToPayload: (form) => ({
      Name: form.name,
      Price: Number(form.price),
      Description: form.description,
      Quantity: Number(form.quantity),
      CategoryId: form.categoryId,
    }),
    mapToForm: (item) => ({
      name: item.name || "",
      price: item.price?.toString() || "",
      description: item.description || "",
      quantity: item.quantity?.toString() || "",
      categoryId: item.categoryId || "",
    }),
    mapToRow: (item) => ({
      id: item.id,
      name: item.name,
      categoryName: item.categoryName || "",
      price: item.price,
      quantity: item.quantity,
      description: item.description || "",
    }),
  });

  return {
    ...crud,
    productForm: crud.formData,
    setProductForm: crud.setFormData,
    targetProduct: crud.targetItem,
    handleFormSubmit: crud.handleSubmit,
    handleEditClick: crud.handleEditClick,
    resetForm: crud.resetForm,
    categoryOptions,
    fetchCategoryOptions,
  };
}
