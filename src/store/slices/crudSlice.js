import { createSlice } from "@reduxjs/toolkit";

const defaultEntityState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  totalCount: 0,
};

const initialState = {
  byEntity: {},
};

const crudSlice = createSlice({
  name: "crud",
  initialState,
  reducers: {
    setItems(state, action) {
      const { entity, items } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].items = items;
    },
    setLoading(state, action) {
      const { entity, loading } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].loading = loading;
    },
    setError(state, action) {
      const { entity, error } = action.payload;
      if (!state.byEntity[entity]) {
        state.byEntity[entity] = { ...defaultEntityState };
      }
      state.byEntity[entity].error = error;
    },
    setPageInfo(state, action) {
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

const selectorsCache = {};

export const selectEntityState = (entity) => {
  if (!selectorsCache[entity]) {
    selectorsCache[entity] = (state) =>
      state.crud.byEntity[entity] || defaultEntityState;
  }
  return selectorsCache[entity];
};

export default crudSlice.reducer;
