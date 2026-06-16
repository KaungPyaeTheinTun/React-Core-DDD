import { useState, useCallback } from "react";
import { useCrud } from "./useCrud";
import { messengerApi } from "../api/messengerApi";
import { commonTableApi } from "../api/commonTableApi";

export function useMessenger() {
  const [statusOptions, setStatusOptions] = useState([]);

  const fetchOptions = useCallback(async () => {
    try {
      const response = await commonTableApi.list(1, 999);
      const allItems = response?.data?.items ?? [];
      const statusItems = allItems.filter(
        (item) => item.type === "MessengerStatus"
      );
      setStatusOptions(
        statusItems.map((item) => ({ value: item.code, label: item.name }))
      );
    } catch {
      setStatusOptions([]);
    }
  }, []);

  const crud = useCrud({
    apiService: messengerApi,
    entityName: "messengers",
    initialForm: { Name: "", status: "" },
    mapToPayload: (form) => ({
      Name: form.Name,
      Status: form.status,
    }),
    mapToForm: (item) => ({
      Name: item.name || "",
      status: item.status || "",
    }),
    mapToRow: (item) => ({
      id: item.id,
      Name: item.name,
      status: item.statusName || item.status || "",
    }),
  });

  return {
    ...crud,
    messengerForm: crud.formData,
    setMessengerForm: crud.setFormData,
    targetMessenger: crud.targetItem,
    handleFormSubmit: crud.handleSubmit,
    handleEditClick: crud.handleEditClick,
    resetForm: crud.resetForm,
    statusOptions,
    fetchOptions,
  };
}
