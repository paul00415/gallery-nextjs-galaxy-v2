'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Image } from '@heroui/react';

type ImageInputProps = {
  value?: File | null;
  previewUrl?: string | null;
  onChange?: (file: File | null) => void;
  maxSizeMB?: number;
  hasError?: boolean;
  errorMessage?: string;
};

export default function ImageInput({
  value,
  previewUrl,
  onChange,
  maxSizeMB = 5,
  hasError = false,
  errorMessage,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Show existing image ONLY if no new file is selected */
  useEffect(() => {
    if (!value && previewUrl) {
      setPreview(previewUrl);
    }
  }, [previewUrl, value]);

  /* Revoke blob URLs safely */
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
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
    if (!file) return;

    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const url = URL.createObjectURL(file);
    setPreview(url);        // shows immediately
    onChange?.(file);

    // allow re-selecting same file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative w-48 h-48 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center
          ${hasError || error ? 'bg-[#fee7ef]' : 'bg-gray-100'}`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
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

      {(error || hasError) && (
        <p className="text-sm text-red-600 text-center">
          {error || errorMessage}
        </p>
      )}

      {previewUrl && !value && (
        <p className="text-xs text-gray-500 text-center">
          Click image to replace
        </p>
      )}
    </div>
  );
}
