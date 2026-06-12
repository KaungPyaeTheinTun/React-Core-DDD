import { useCrud } from "./useCrud";
import { roleApi } from "../api/roleApi";

export function useRoles() {
  const crud = useCrud({
    apiService: roleApi,
    entityName: "Role",
    initialForm: { name: "" },
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
    roleForm: crud.formData,
    setRoleForm: crud.setFormData,
    handleFormSubmit: crud.handleSubmit,
  };
}
