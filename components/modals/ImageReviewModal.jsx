'use client';

import React, { useEffect, useRef } from 'react';
import { Image } from '@heroui/react';

export default function ImagePreviewModal({ selected, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }

    if (selected) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selected, onClose]);

  if (!selected) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white shadow cursor-pointer"
        >
          ✕
        </button>

        <Image src={selected.imageUrl} alt={selected.title} width={`90%`} />

        <div className="mt-2 text-center text-white">{selected.title}</div>
      </div>
    </div>
  );
}
