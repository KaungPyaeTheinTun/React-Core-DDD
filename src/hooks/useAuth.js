import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
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
          const response = await authApi.login({
            email: formData.email,
            password: formData.password,
          });

          // Remember your backend wraps everything in an ApiResponse structure containing a '.data' field
          const authData = response.data.data;

          if (authData?.access_token) {
            localStorage.setItem("token", authData.access_token);
            localStorage.setItem("refresh_token", authData.refresh_token);
            localStorage.setItem("user", JSON.stringify(authData.user));

            showNewCommentToast(
              "System",
              `Welcome back, ${authData.user.fullName}!`,
            );

            navigate("/users");
          } else {
            setError("Authentication payload missing.");
          }
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
