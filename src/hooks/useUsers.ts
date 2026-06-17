import { useCrud } from "./useCrud";
import { userApi } from "../api/userApi";

interface UserForm {
  fullName: string;
  email: string;
}

interface UserItem {
  id: string;
  fullName: string;
  email: string;
  roles: string[] | string;
  roleNames?: string;
  status?: string;
}

interface UserPayload {
  FullName: string;
  Email: string;
}

interface UserRow {
  id: string;
  fullName: string;
  email: string;
  roles: string;
  status?: string;
}

export function useUsers() {
  const crud = useCrud<UserForm, UserPayload, UserItem, UserRow>({
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
      roles: Array.isArray(item.roles)
        ? item.roles.join(", ")
        : item.roles || item.roleNames || "",
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
