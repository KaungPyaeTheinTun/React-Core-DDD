import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface EntityState {
  items: unknown[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
}

interface CrudState {
  byEntity: Record<string, EntityState>;
}

const defaultEntityState: EntityState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  totalCount: 0,
};

const initialState: CrudState = {
  byEntity: {},
};

interface SetItemsPayload {
  entity: string;
  items: unknown[];
}

interface SetLoadingPayload {
  entity: string;
  loading: boolean;
}

interface SetErrorPayload {
  entity: string;
  error: string | null;
}

interface SetPageInfoPayload {
  entity: string;
  page: number;
  pageSize: number;
  totalCount: number;
}

const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<SetItemsPayload>) {
      const { entity, items } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].items = items;
    },
    setLoading(state, action: PayloadAction<SetLoadingPayload>) {
      const { entity, loading } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].loading = loading;
    },
    setError(state, action: PayloadAction<SetErrorPayload>) {
      const { entity, error } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].error = error;
    },
    setPageInfo(state, action: PayloadAction<SetPageInfoPayload>) {
      const { entity, page, pageSize, totalCount } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].page = page;
      state.byEntity[entity].pageSize = pageSize;
      state.byEntity[entity].totalCount = totalCount;
    },
  },
});

export const { setItems, setLoading, setError, setPageInfo } = crudSlice.actions;

const selectorsCache: Record<string, (state: RootState) => EntityState> = {};

export const selectEntityState = (entity: string): ((state: RootState) => EntityState) => {
  if (!selectorsCache[entity]) {
    selectorsCache[entity] = (state: RootState) =>
      state.crud.byEntity[entity] || defaultEntityState;
  }
  return selectorsCache[entity];
};

export const selectAnyLoading = (state: RootState): boolean =>
  Object.values(state.crud.byEntity).some((e) => e.loading);

export default crudSlice.reducer;
