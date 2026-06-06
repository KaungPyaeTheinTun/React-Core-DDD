import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api.js";
import { showNewCommentToast } from "../utils/toast.jsx";

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Consolidated state matching both login and register fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Reusable change utility memoized to prevent input re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Shared submit gateway handler logic
  const handleAuthSubmit = useCallback(
    async (e, isRegister = false) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        if (isRegister) {
          // 1. Handle Registration Pipeline
          await authApi.register(formData);
          showNewCommentToast(
            "Account",
            "Account created successfully! Please sign in.",
          );
          navigate("/login");
        } else {
          // 2. Handle Login Pipeline
          const data = await authApi.login({
            email: formData.email,
            password: formData.password,
          });

          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          showNewCommentToast("System", `Welcome back, ${data.user.fullName}!`);
          navigate("/users");
        }
      } catch (err) {
        const fallbackMsg = isRegister
          ? "Registration failed. Try again."
          : "Invalid email or password";
        setError(err.response?.data?.message || fallbackMsg);
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate],
  );

  return {
    formData,
    error,
    loading,
    handleChange,
    handleAuthSubmit,
  };
}
