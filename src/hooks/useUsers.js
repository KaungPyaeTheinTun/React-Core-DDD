import { useCrud } from "./useCrud";
import { userApi } from "../api/userApi";

export function useUsers() {
  const crud = useCrud({
    apiService: userApi,

    entityName: "User",

    initialForm: {
      fullName: "",
      email: "",
    },

    mapToPayload: (form) => ({
      FullName: form.fullName,
      Email: form.email,
    }),

    mapToForm: (item) => ({
      fullName: item.fullName,
      email: item.email,
    }),

    mapToRow: (item) => ({
      id: item.id,
      fullName: item.fullName,
      email: item.email,
      status: item.status,
    }),
  });

  return {
    ...crud,

    userForm: crud.formData,
    setUserForm: crud.setFormData,
    targetUser: crud.targetItem,
    handleEditSubmit: crud.handleSubmit,
  };
}
