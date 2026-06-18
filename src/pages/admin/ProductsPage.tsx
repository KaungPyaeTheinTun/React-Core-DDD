import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PackagePlus, Trash2, Edit3, X } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import DataTable from "../../components/ui/DataTable";
import DeleteModal from "../../components/ui/DeleteModal";
import Pagination from "../../components/ui/Pagination";
import CreateForm from "../../components/products/CreateForm";
import EditForm from "../../components/products/EditForm";
import { useProducts } from "../../hooks/useProducts";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2 } },
};

function DescriptionCell({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const words = text.split(/\s+/);
  const truncated = words.length > 6 ? words.slice(0, 6).join(" ") + "..." : text;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: rect.left, y: rect.top });
        setShow(true);
      }}
      onMouseLeave={() => setShow(false)}
    >
      <span>{truncated}</span>
      {show && words.length > 6 && createPortal(
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[9999] max-w-xs rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 shadow-lg pointer-events-none"
          style={{ left: pos.x, top: pos.y - 8, transform: "translateY(-100%)" }}
        >
          {text}
        </motion.div>,
        document.body
      )}
    </div>
  );
}

export default function ProductsPage() {
  const {
    loading,
    error,
    showForm,
    setShowForm,
    editingId,
    productForm,
    setProductForm,
    submitLoading,
    deleteModalOpen,
    setDeleteModalOpen,
    targetProduct,
    formattedRows,
    handleFormSubmit,
    handleEditClick,
    openDeleteConfirmation,
    handleConfirmDelete,
    resetForm,
    categoryOptions,
    fetchCategoryOptions,
    imageFiles,
    setImageFiles,
    page,
    totalPages,
    handlePageChange,
  } = useProducts();

  useEffect(() => {
    if (showForm || editingId) {
      fetchCategoryOptions();
    }
  }, [showForm, editingId, fetchCategoryOptions]);

  const columns = ["Image", "Product Name", "Category", "Price", "Qty", "Description"];

  const renderTableActions = useCallback(
    (row: any) => (
      <div className="flex w-full items-center justify-end gap-1">
        <button
          onClick={() => handleEditClick(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Edit Product"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => openDeleteConfirmation(row)}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
          title="Delete Product"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
    [handleEditClick, openDeleteConfirmation],
  );

  const renderCell = useCallback((value: unknown, colIndex: number) => {
    if (colIndex === 5) {
      return <DescriptionCell text={value as string} />;
    }
  }, []);

  const headerAction = (
    <button
      onClick={() => (showForm || editingId ? resetForm() : setShowForm(true))}
      className="flex items-center gap-1.5 rounded-xl bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition"
    >
      {showForm || editingId ? (
        <X className="h-3.5 w-3.5" />
      ) : (
        <PackagePlus className="h-3.5 w-3.5" />
      )}
      {showForm || editingId ? "Cancel" : "Add Product"}
    </button>
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-4 md:p-6 max-w-full mx-auto space-y-6 bg-white text-black"
    >
      <AnimatePresence mode="popLayout">
        {showForm && !editingId && (
          <CreateForm
            cardVariants={cardVariants}
            productForm={productForm as unknown as Record<string, unknown>}
            setProductForm={setProductForm as unknown as (value: Record<string, unknown>) => void}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
            categoryOptions={categoryOptions}
            imageFiles={imageFiles as (string | File)[]}
            setImageFiles={setImageFiles as (files: (string | File)[]) => void}
          />
        )}

        {editingId && (
          <EditForm
            cardVariants={cardVariants}
            productForm={productForm as unknown as Record<string, unknown>}
            setProductForm={setProductForm as unknown as (value: Record<string, unknown>) => void}
            handleFormSubmit={handleFormSubmit}
            submitLoading={submitLoading}
            resetForm={resetForm}
            categoryOptions={categoryOptions}
            imageFiles={imageFiles as (string | File)[]}
            setImageFiles={setImageFiles as (files: (string | File)[]) => void}
          />
        )}
      </AnimatePresence>

      <motion.div variants={cardVariants}>
        <SectionCard title="Products" action={headerAction}>
          {loading ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider animate-pulse">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-zinc-400 text-xs font-medium uppercase tracking-wider">
              Product data unavailable.
            </div>
          ) : formattedRows.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No products yet.
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                rows={formattedRows}
                renderActions={renderTableActions}
                renderCell={renderCell}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </SectionCard>
      </motion.div>

      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            itemName={(targetProduct as { name?: string })?.name || ""}
            title="Remove Product"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
