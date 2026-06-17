import { useState, useCallback } from "react";
import { useCrud } from "./useCrud";
import { messengerApi } from "../api/messengerApi";
import { commonTableApi } from "../api/commonTableApi";

interface MessengerForm {
  Name: string;
  status: string;
}

interface MessengerItem {
  id: string;
  name: string;
  status: string;
  statusName: string;
}

interface MessengerPayload {
  Name: string;
  Status: string;
}

interface MessengerRow {
  id: string;
  Name: string;
  status: string;
}

export function useMessenger() {
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  const fetchOptions = useCallback(async () => {
    try {
      const response = await commonTableApi.list(1, 999);
      const allItems = response?.data?.items ?? [];
      const statusItems = allItems.filter(
        (item) => (item as Record<string, unknown>).type === "MessengerStatus"
      );
      setStatusOptions(
        statusItems.map((item) => (item as Record<string, unknown>).code as string)
      );
    } catch {
      setStatusOptions([]);
    }
  }, []);

  const crud = useCrud<MessengerForm, MessengerPayload, MessengerItem, MessengerRow>({
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
