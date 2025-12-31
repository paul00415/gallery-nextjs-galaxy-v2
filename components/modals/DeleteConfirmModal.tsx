'use client';

interface DeleteConfirmModalProps {
  target: {
    title: string;
    // add other fields if needed (id, url, etc.)
  } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  target,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-base-800 rounded-lg p-6 w-full max-w-sm shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-2">Delete Image</h2>

        <p className="text-sm text-muted mb-4">
          Are you sure you want to delete <strong>{target.title}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
