import { useCrud } from "./useCrud";
import { categoryApi } from "../api/categoryApi";

export function useCategories() {
  const crud = useCrud({
    apiService: categoryApi,

    entityName: "categories",

    initialForm: {
      name: "",
      price: 0,
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
  };
}
