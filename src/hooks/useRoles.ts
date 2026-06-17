import { useCrud } from "./useCrud";
import { roleApi } from "../api/roleApi";

interface RoleForm {
  name: string;
}

interface RoleItem {
  id: string;
  name: string;
}

interface RolePayload {
  Name: string;
}

interface RoleRow {
  id: string;
  name: string;
}

export function useRoles() {
  const crud = useCrud<RoleForm, RolePayload, RoleItem, RoleRow>({
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
