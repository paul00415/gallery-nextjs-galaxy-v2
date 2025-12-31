'use client';

import { Input } from '@heroui/react';
import type { ChangeEvent } from 'react';

interface NormalInputProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
}

export default function NormalInput({
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  error,
  className,
  ...props
}: NormalInputProps) {
  const hasError = Boolean(error);

  return (
    <div className={`w-full ${className}`}>
      <Input
        label={label}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={hasError}
        aria-invalid={hasError}
        {...props}
      />

      {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
