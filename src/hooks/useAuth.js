import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { showNewCommentToast } from "../utils/toast.jsx";

export function useAuth() {
  const navigate = useNavigate();
  const errorRef = useRef("");
  const [error, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Sync both ref and state so the value persists across re-renders
  const setError = useCallback((msg) => {
    errorRef.current = msg;
    setErrorState(msg);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAuthSubmit = useCallback(
    async (e, isRegister = false) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        if (isRegister) {
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
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("FULL ERROR:", err);

        const fallbackMsg = isRegister
          ? "Registration failed. Try again."
          : "Invalid email or password";

        setError(err.response?.data?.message || fallbackMsg);
      } finally {
        setLoading(false);
        // Restore error from ref in case the re-render wiped the state
        setErrorState(errorRef.current);
      }
    },
    [formData, navigate, setError],
  );

  return {
    formData,
    error,
    loading,
    handleChange,
    handleAuthSubmit,
  };
}
