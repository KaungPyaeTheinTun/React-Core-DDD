import { useState, useEffect, useMemo, useCallback } from "react";
import { userApi } from "../services/api.js";
import { showNewCommentToast } from "../utils/toast.jsx";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userForm, setUserForm] = useState({ name: "", email: "" });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  // Inside useUsers.js
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.list(); // This returns (await api.get("UsersApi")).data

      // Fix: Drill down to response.data.items where your array actually sits
      const actualUsers = response?.data?.items || [];

      setUsers(actualUsers);
    } catch (err) {
      setError("Failed to load users from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const resetForm = useCallback(() => {
    setUserForm({ name: "", email: "" });
    setEditingId(null);
    setShowForm(false);
  }, []);

  const handleEditSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setSubmitLoading(true);
        const payload = { FullName: userForm.name, Email: userForm.email };
        await userApi.update(editingId, payload);
        showNewCommentToast(
          "User Admin ",
          `Updated profile: ${payload.FullName}`,
        );
        resetForm();
        fetchUsers();
      } catch (err) {
        showNewCommentToast(
          "User Admin Error",
          err.response?.data?.message || "Failed to update user.",
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingId, userForm, fetchUsers, resetForm],
  );

  const handleEditClick = useCallback(
    (userRow) => {
      const originalUser = users.find((u) => u.id === userRow.id);
      if (!originalUser) return;
      setEditingId(originalUser.id);
      setUserForm({
        name: originalUser.fullName || originalUser.name || "",
        email: originalUser.email || "",
      });
      setShowForm(true);
    },
    [users],
  );

  const openDeleteConfirmation = useCallback(
    (userRow) => {
      const originalUser = users.find((u) => u.id === userRow.id);
      if (!originalUser) return;
      setTargetUser(originalUser);
      setDeleteModalOpen(true);
    },
    [users],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!targetUser) return;
    try {
      await userApi.remove(targetUser.id);
      showNewCommentToast(
        "User Admin",
        `Deleted account: “${targetUser.fullName || targetUser.name}”`,
      );
      if (editingId === targetUser.id) resetForm();
      setDeleteModalOpen(false);
      setTargetUser(null);
      fetchUsers();
    } catch (err) {
      showNewCommentToast(
        "User Admin Error",
        err.response?.data?.message || "Failed to delete user.",
      );
    }
  }, [targetUser, editingId, fetchUsers, resetForm]);

  // Caches the formatted rows so table data doesn't map on random UI state triggers
  const formattedRows = useMemo(() => {
    // Ensure users is treated as an array even if it's undefined initially
    const usersArray = Array.isArray(users) ? users : [];

    return usersArray.map((user) => ({
      id: user.id,
      name: user.fullName || user.name || "",
      email: user.email || "",
    }));
  }, [users]);

  return {
    users,
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    userForm,
    setUserForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetUser,
    setTargetUser,
    formattedRows,
    handleEditSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
  };
}
