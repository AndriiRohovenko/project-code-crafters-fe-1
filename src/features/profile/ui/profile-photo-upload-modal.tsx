import React, { useEffect, useRef, useState } from 'react';

import { updateUsersAvatar } from '@/api/api.gen';
import { BaseModal } from '@/shared/ui/base-modal';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';

interface ProfilePhotoUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (avatarUrl: string) => void;
}

export const ProfilePhotoUploadModal: React.FC<
  ProfilePhotoUploadModalProps
> = ({ onClose, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelectClick = () => {
    // Clear current selection before choosing a new one
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setImageFile(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    // Revoke old preview URL before replacing
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleUpload = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', imageFile);

      const updatedUser = await updateUsersAvatar(formData);
      if (updatedUser.avatar) {
        onUploadSuccess(updatedUser.avatar);
      }
      onClose();
    } catch (error) {
      console.error('Avatar upload error:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to upload avatar. Please try again.';
      window.alert(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <BaseModal onClose={onClose}>
      <h2 className="mb-8 text-[28px] font-bold uppercase leading-tight text-black md:text-[32px]">
        Upload Photo
      </h2>

      <div className="flex flex-col items-center">
        <div className="h-[260px] w-full items-center justify-center overflow-hidden rounded-[40px] border border-dashed border-light-grey bg-white md:h-[400px]">
          <div className="flex h-full w-full flex-col items-center justify-center text-center text-sm text-black">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile photo preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <button
                type="button"
                onClick={handleImageSelectClick}
                className="text-black/70 flex flex-col items-center justify-center text-center text-sm"
              >
                <Icon name="camera" size={49} className="mb-2" />
                <span>Upload a photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        {imagePreview && (
          <button
            type="button"
            onClick={handleImageSelectClick}
            className="mt-3 text-center text-sm font-medium text-black underline transition hover:opacity-80"
          >
            Upload another photo
          </button>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          type="button"
          variant="outline-grey"
          label="Cancel"
          onClick={onClose}
          className="flex-1"
          disabled={isUploading}
        />
        <Button
          type="button"
          label={isUploading ? 'Uploading...' : 'Upload'}
          onClick={handleUpload}
          disabled={!imageFile || isUploading}
          className="flex-1"
        />
      </div>
    </BaseModal>
  );
};
