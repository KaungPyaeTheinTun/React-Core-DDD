import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import crudReducer from "./slices/crudSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crud: crudReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
