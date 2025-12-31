'use client';

import { Textarea } from '@heroui/react';

interface TextInputProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  minRows?: number;
  maxRows?: number;
}

export default function TextareaInput({
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  error,
  className = '',
  minRows = 3,
  maxRows,
  ...props
}: TextInputProps) {
  const hasError = Boolean(error);

  return (
    <div className={`w-full ${className}`}>
      <Textarea
        label={label}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        placeholder={placeholder}
        isInvalid={hasError}
        aria-invalid={hasError}
        minRows={minRows}
        maxRows={maxRows}
        {...props}
      />

      {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
