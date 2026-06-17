import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { authApi } from "../../api/authApi";
import { extractRolesFromToken } from "../../utils/auth";

interface AuthState {
  user: { id: string; email: string; fullName: string } | null;
  token: string | null;
  roles: string[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

function getAuthErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as {
    response?: { data?: unknown };
    message?: string;
  };
  const data = axiosErr.response?.data;

  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.message === "string") return d.message;
    if (typeof d.title === "string") return d.title;
    if (d.errors && typeof d.errors === "object") {
      return Object.values(d.errors as Record<string, string[]>)
        .flat()
        .join(" ");
    }
  }

  return axiosErr.message || fallback;
}

export const loginThunk = createAsyncThunk<
  { user: any; token: string; refreshToken: string; roles: string[] },
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      const authData = response.data.data;

      if (!authData?.access_token) {
        return rejectWithValue("Authentication payload missing.");
      }

      const roles = extractRolesFromToken(authData.access_token);

      return {
        user: authData.user,
        token: authData.access_token,
        refreshToken: authData.refresh_token,
        roles,
      };
    } catch (err) {
      return rejectWithValue(
        getAuthErrorMessage(err, "Invalid email or password"),
      );
    }
  },
);

export const registerThunk = createAsyncThunk<
  void,
  { email: string; fullName: string; password: string },
  { rejectValue: string }
>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      await authApi.register(payload);
      return;
    } catch (err) {
      return rejectWithValue(
        getAuthErrorMessage(err, "Registration failed. Try again."),
      );
    }
  },
);

function hydrateAuth(): Pick<
  AuthState,
  "user" | "token" | "roles" | "isAuthenticated"
> {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") ?? "null");
    const roles = JSON.parse(localStorage.getItem("roles") ?? "[]");
    return {
      user: user || null,
      token: token || null,
      roles: roles || [],
      isAuthenticated: !!token,
    };
  } catch {
    return { user: null, token: null, roles: [], isAuthenticated: false };
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...hydrateAuth(),
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
    },
    clearError(state, _action: PayloadAction<string>) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refresh_token", action.payload.refreshToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("roles", JSON.stringify(action.payload.roles));
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectIsAdmin = (state: RootState) =>
  state.auth.roles.some((r) => r.toLowerCase() === "admin");
export const selectHasAdminAccess = (state: RootState) =>
  state.auth.roles.some((r) =>
    ["admin", "editor"].includes(r.toLowerCase()),
  );

export default authSlice.reducer;
