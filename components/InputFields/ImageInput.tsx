'use client';

import React, { useRef, useState, useEffect, useEffectEvent } from 'react';
import { Image } from '@heroui/react';

type ImageInputProps = {
  value?: File | null;
  previewUrl?: string | null;
  onChange?: (file: File | null) => void;
  maxSizeMB?: number;
  noImage?: string;
  required?: boolean;
};

export default function ImageInput({
  value,
  previewUrl,
  onChange,
  maxSizeMB = 5,
  required = false,
  noImage,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(
    value ? URL.createObjectURL(value) : null
  );
  const [error, setError] = useState<string | null>(null);

  const setPreviewInit = useEffectEvent((previewUrl: string) => {
    setPreview(previewUrl);
  });

  useEffect(() => {
    if (previewUrl) {
      setPreviewInit(previewUrl);
    }
  }, [previewUrl]);

  // cleanup blob URLs
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function validate(file: File): string | null {
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed.';
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Image must be smaller than ${maxSizeMB}MB.`;
    }

    return null;
  }

  function handleSelect(file: File | null) {
    if (!file) {
      if (required && !previewUrl) {
        setError('Image is required');
      } else {
        setError(null);
      }
      return;
    }

    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative w-48 h-48 border-2 border-dashed rounded-lg cursor-pointer overflow-hidden flex items-center justify-center
          ${error || noImage ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-100'}`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className=" h-full object-cover"
            width={`100%`}
          />
        ) : (
          <span className="text-sm text-gray-500 text-center px-2">
            Click to add image
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error || noImage}</p>}

      {previewUrl && !value && (
        <p className="text-xs text-gray-500 text-center">
          Click image to replace
        </p>
      )}
    </div>
  );
}
