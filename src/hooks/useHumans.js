import { useCrud } from "./useCrud";
import { humanApi } from "../api/humanApi";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

export function useHumans() {
  const crud = useCrud({
    apiService: humanApi,
    entityName: "humans",
    initialForm: {
      systemCode: "HUMAN",
      name: "",
      age: "",
      email: "",
      gender: "",
    },
    mapToPayload: (form) => ({
      SystemCode: form.systemCode,
      Name: form.name,
      Age: Number(form.age),
      Email: form.email,
      Gender: form.gender,
    }),
    mapToForm: (item) => ({
      systemCode: item.systemCode || "",
      name: item.name || "",
      age: item.age ?? "",
      email: item.email || "",
      gender: item.gender || "",
    }),
    mapToRow: (item) => ({
      id: item.id,
      systemCode: item.systemCode,
      name: item.name,
      age: item.age,
      email: item.email,
      gender: item.gender,
    }),
  });

  return {
    ...crud,
    humanForm: crud.formData,
    setHumanForm: crud.setFormData,
    targetHuman: crud.targetItem,
    handleFormSubmit: crud.handleSubmit,
    handleEditClick: crud.handleEditClick,
    resetForm: crud.resetForm,
    GENDER_OPTIONS,
  };
}
