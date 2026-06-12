import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginThunk, registerThunk, clearError } from "../store/slices/authSlice";
import { showNewCommentToast } from "../utils/toast.jsx";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthSubmit = useCallback(
    async (e, isRegister = false) => {
      e.preventDefault();

      const form = e.target.closest("form");
      const formDataObj = new FormData(form);
      const formData = {
        fullName: formDataObj.get("fullName") || "",
        email: formDataObj.get("email") || "",
        password: formDataObj.get("password") || "",
      };

      if (isRegister) {
        const result = await dispatch(registerThunk(formData));
        if (registerThunk.fulfilled.match(result)) {
          showNewCommentToast(
            "Account",
            "Account created successfully! Please sign in.",
          );
          navigate("/login");
        }
      } else {
        const result = await dispatch(
          loginThunk({ email: formData.email, password: formData.password }),
        );
        if (loginThunk.fulfilled.match(result)) {
          const user = result.payload.user;
          const roles = result.payload.roles;

          showNewCommentToast(
            "System",
            `Welcome back, ${user.fullName}!`,
          );

          if (roles.some((r) => r.toLowerCase() === "admin")) {
            navigate("/admin/users");
          } else {
            navigate("/user/dashboard");
          }
        }
      }

      dispatch(clearError());
    },
    [dispatch, navigate],
  );

  return { handleAuthSubmit };
}
