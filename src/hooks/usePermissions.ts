import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setItems,
  setLoading,
  setError,
  selectEntityState,
} from "../store/slices/crudSlice";
import { permissionApi } from "../api/permissionApi";

interface PermissionItem {
  id: string;
  name: string;
}

const MODULES_PER_PAGE = 5;

export function usePermissions() {
  const dispatch = useDispatch();
  const entityState = useSelector(selectEntityState("permissions"));
  const { items: rawItems, loading, error } = entityState;
  const items = rawItems as PermissionItem[];
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        dispatch(setLoading({ entity: "permissions", loading: true }));
        dispatch(setError({ entity: "permissions", error: null }));

        const response = await permissionApi.getAll();
        const data = response.data;

        if (!cancelled) {
          dispatch(setItems({ entity: "permissions", items: data.items || [] }));
        }
      } catch (err: unknown) {
        const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
        console.error(apiErr);
        if (!cancelled) {
          dispatch(
            setError({
              entity: "permissions",
              error: apiErr.response?.data?.message || apiErr.message || "Unknown error",
            }),
          );
        }
      } finally {
        if (!cancelled) {
          dispatch(setLoading({ entity: "permissions", loading: false }));
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, { id: string; operation: string; fullName: string }[]> = {};
    items.forEach((item) => {
      const dotIndex = item.name.indexOf(".");
      const module = dotIndex > -1 ? item.name.slice(0, dotIndex) : "Other";
      const operation =
        dotIndex > -1 ? item.name.slice(dotIndex + 1) : item.name;
      if (!groups[module]) groups[module] = [];
      groups[module].push({ id: item.id, operation, fullName: item.name });
    });
    return groups;
  }, [items]);

  const allModuleNames = useMemo(
    () => Object.keys(groupedPermissions).sort(),
    [groupedPermissions],
  );

  const totalPages = Math.ceil(allModuleNames.length / MODULES_PER_PAGE);

  const paginatedModuleNames = useMemo(() => {
    const start = (page - 1) * MODULES_PER_PAGE;
    return allModuleNames.slice(start, start + MODULES_PER_PAGE);
  }, [allModuleNames, page]);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    loading,
    error,
    page,
    totalPages,
    totalModules: allModuleNames.length,
    paginatedModuleNames,
    groupedPermissions,
    handlePageChange,
  };
}
