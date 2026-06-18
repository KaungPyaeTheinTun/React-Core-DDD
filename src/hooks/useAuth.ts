import { useDispatch } from "react-redux";
import { useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginThunk, registerThunk } from "../store/slices/authSlice";
import { showNewCommentToast } from "../utils/toast";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  fullName: string;
  password: string;
}

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>, isRegister = false) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formDataObj = new FormData(form);
      const formData: RegisterPayload = {
        fullName: (formDataObj.get("fullName") as string) || "",
        email: (formDataObj.get("email") as string) || "",
        password: (formDataObj.get("password") as string) || "",
      };

      if (isRegister) {
        const result = await (dispatch as any)(registerThunk(formData as any));
        if (registerThunk.fulfilled.match(result)) {
          showNewCommentToast(
            "Account",
            "Account created successfully! Please sign in.",
          );
          navigate("/login");
        }
      } else {
        const payload: LoginPayload = {
          email: formData.email,
          password: formData.password,
        };
        const result = await (dispatch as any)(loginThunk(payload as any));
        if (loginThunk.fulfilled.match(result)) {
          const user = result.payload.user;
          const roles = result.payload.roles;

          showNewCommentToast(
            "System",
            `Welcome back, ${user.fullName}!`,
          );

          if (roles.some((r: string) => ["admin", "editor"].includes(r.toLowerCase()))) {
            navigate("/admin/categories");
          } else {
            navigate("/user/dashboard");
          }
        }
      }
    },
    [dispatch, navigate],
  );

  return { handleAuthSubmit };
}
