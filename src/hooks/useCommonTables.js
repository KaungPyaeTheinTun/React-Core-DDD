import { useCrud } from "./useCrud";
import { commonTableApi } from "../api/commonTableApi";

export function useCommonTables() {
  const crud = useCrud({
    apiService: commonTableApi,
    entityName: "commonTables",
    initialForm: { type: "", code: "", name: "" },
    mapToPayload: (form) => ({
      Type: form.type,
      Code: form.code,
      Name: form.name,
    }),
    mapToForm: (item) => ({
      type: item.type || "",
      code: item.code || "",
      name: item.name || "",
    }),
    mapToRow: (item) => ({
      id: item.id,
      type: item.type,
      code: item.code,
      name: item.name,
    }),
  });

  return {
    ...crud,
    commonTableForm: crud.formData,
    setCommonTableForm: crud.setFormData,
    targetCommonTable: crud.targetItem,
    handleFormSubmit: crud.handleSubmit,
    handleEditClick: crud.handleEditClick,
    resetForm: crud.resetForm,
  };
}
