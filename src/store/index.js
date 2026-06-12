import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import crudReducer from "./slices/crudSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crud: crudReducer,
  },
});
