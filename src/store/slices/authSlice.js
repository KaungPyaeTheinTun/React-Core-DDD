import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import { extractRolesFromToken } from "../../utils/auth";

function getAuthErrorMessage(err, fallback) {
  const data = err.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  if (data?.errors) {
    return Object.values(data.errors).flat().join(" ");
  }

  return err.message || fallback;
}

export const loginThunk = createAsyncThunk(
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

export const registerThunk = createAsyncThunk(
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

function hydrateAuth() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const roles = JSON.parse(localStorage.getItem("roles"));
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
  },
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
    clearError(state) {
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
        state.error = action.payload;
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
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRoles = (state) => state.auth.roles;
export const selectIsAdmin = (state) =>
  state.auth.roles.some((r) => r.toLowerCase() === "admin");

export default authSlice.reducer;
