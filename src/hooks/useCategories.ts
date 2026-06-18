import { useCrud } from "./useCrud";
import { categoryApi } from "../api/categoryApi";

interface CategoryForm {
  name: string;
}

interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryPayload {
  Name: string;
}

interface CategoryRow {
  id: string;
  name: string;
}

export function useCategories() {
  const crud = useCrud<CategoryForm, CategoryPayload, CategoryItem, CategoryRow>({
    apiService: categoryApi,
    entityName: "categories",
    mediaEnabled: false,
    initialForm: {
      name: "",
    },
    mapToPayload: (form) => ({
      Name: form.name,
    }),
    mapToForm: (item) => ({
      name: item.name,
    }),
    mapToRow: (item) => ({
      id: item.id,
      name: item.name,
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
