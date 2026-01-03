'use client';

import React, { useEffect, useState } from 'react';
import ImagePreviewModal from './modals/ImageReviewModal';
import { Image } from '@heroui/react';



export interface Photo {
  id: number;
  title: string;
  desc: string;
  imageUrl: string;
  createdAt?: string;
  poster: {
    id: number;
    name: string;
  };
}

interface ImageListShowProps {
  items?: Photo[];
}


export default function ImageListShow({ items }: ImageListShowProps) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);

  function closePreview() {
    setSelected(null);
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closePreview();
        closeDeleteModal();
      }
    }

    if (selected || deleteTarget) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, deleteTarget]);

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
            {/* Image */}
            <div className="relative flex items-center justify-center overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                className="block h-30 w-full object-cover"
                onClick={() => setSelected(item)}
              />
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
                <span>{item.poster?.name ?? 'Unknown'}</span>
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

      {/* Image Preview Modal */}
      <ImagePreviewModal
        selected={selected}
        onClose={closePreview}
      />
    </div>
  );
}
