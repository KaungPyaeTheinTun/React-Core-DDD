import { useCrud } from "./useCrud";
import { categoryApi } from "../api/categoryApi";

interface CategoryForm {
  name: string;
  price: number;
  description: string;
}

interface CategoryItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface CategoryPayload {
  Name: string;
  Price: number;
  Description: string;
}

interface CategoryRow {
  id: string;
  name: string;
  price: number;
  description: string;
}

export function useCategories() {
  const crud = useCrud<CategoryForm, CategoryPayload, CategoryItem, CategoryRow>({
    apiService: categoryApi,
    entityName: "categories",
    mediaEnabled: true,
    initialForm: {
      name: "",
      price: 1,
      description: "",
    },
    mapToPayload: (form) => ({
      Name: form.name,
      Price: Number(form.price),
      Description: form.description,
    }),
    mapToForm: (item) => ({
      name: item.name,
      price: item.price,
      description: item.description || "",
    }),
    mapToRow: (item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
    }),
  });

  return {
    ...crud,
    categoryForm: crud.formData,
    setCategoryForm: crud.setFormData,
    targetCategory: crud.targetItem,
    handleFormSubmit: crud.handleSubmit,
    handleEditClick: crud.handleEditClick,
    resetForm: crud.resetForm,
  };
}
