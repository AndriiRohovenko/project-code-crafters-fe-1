import React, { useEffect, useRef, useState } from 'react';

import { Icon } from '@/shared/ui/icon';

interface FileUploadProps {
  file?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  label?: string;
  replaceLabel?: string;
  containerClassName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onChange,
  accept = 'image/*',
  label = 'Upload a photo',
  replaceLabel = 'Upload another photo',
  containerClassName,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const openFilePicker = () => {
    // Clear current selection before choosing a new one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    onChange(nextFile);
  };

  // Keep preview in sync with external file prop
  useEffect(() => {
    // Revoke previous URL when file changes
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={
          `h-[260px] w-full items-center justify-center overflow-hidden rounded-[40px] border border-dashed border-light-grey bg-white md:h-[400px]` +
          (containerClassName ? ` ${containerClassName}` : '')
        }
      >
        <div className="flex h-full w-full flex-col items-center justify-center text-center text-sm text-black">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="text-black/70 flex flex-col items-center justify-center text-center text-sm"
            >
              <Icon name="camera" size={49} className="mb-2" />
              <span>{label}</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      {previewUrl && (
        <button
          type="button"
          onClick={openFilePicker}
          className="mt-3 text-center text-sm font-medium text-black underline transition hover:opacity-80"
        >
          {replaceLabel}
        </button>
      )}
    </div>
  );
};
