'use client';

import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import ImagePreviewModal from './modals/ImageReviewModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import ImageModal from './modals/ImageModal';
import { Image } from '@heroui/react';
import { useAppDispatch } from '@/store/hooks';
import { deletePhoto } from '@/store/photo/photoSlice';

/* ---------- Types ---------- */

interface Poster {
  id: number;
  name: string;
}

export interface Photo {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
  createdAt?: string;
  poster?: Poster;
}

interface ImageListProps {
  items?: Photo[];
}

/* ---------- Component ---------- */

export default function ImageList({ items }: ImageListProps) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
  const [editTarget, setEditTarget] = useState<Photo | null>(null);

  const dispatch = useAppDispatch();

  function closePreview() {
    setSelected(null);
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
  }

  function closeEditModal() {
    setEditTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    dispatch(deletePhoto(deleteTarget.id));
    setDeleteTarget(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closePreview();
        closeDeleteModal();
        closeEditModal();
      }
    }

    if (selected || deleteTarget || editTarget) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, deleteTarget, editTarget]);

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-12 text-center text-muted">
        No photos found
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="group bg-white dark:bg-base-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
          >
            {/* Image + overlay + buttons */}
            <div className="relative flex items-center justify-center overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                className="block h-30 w-full object-cover"
                onClick={() => setSelected(item)}
              />

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(item);
                  }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white text-black shadow cursor-pointer"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditTarget(item);
                  }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 text-white shadow cursor-pointer"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(item);
                  }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white shadow cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-medium truncate">
                Title: {item.title}
              </h3>

              <p className="text-xs text-muted truncate">
                Desc: {item.desc}
              </p>

              <div className="flex justify-between text-xs text-muted">
                <span>
                  {item.createdAt
                    ? item.createdAt.split('T')[0]
                    : ''}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modals */}
      <ImagePreviewModal
        selected={selected}
        onClose={closePreview}
      />

      <DeleteConfirmModal
        target={deleteTarget}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <ImageModal
        isOpen={!!editTarget}
        onClose={closeEditModal}
        mode="edit"
        initialData={editTarget}
      />
    </div>
  );
}
