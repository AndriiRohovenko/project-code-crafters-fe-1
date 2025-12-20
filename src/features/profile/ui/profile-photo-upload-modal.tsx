import React, { useState } from 'react';

import { updateUsersAvatar } from '@/api/api.gen';
import { BaseModal } from '@/shared/ui/base-modal';
import { Button } from '@/shared/ui/button';
import { FileUpload } from '@/shared/ui/file-upload';

interface ProfilePhotoUploadModalProps {
  onClose: () => void;
  onUploadSuccess: (avatarUrl: string) => void;
}

export const ProfilePhotoUploadModal: React.FC<
  ProfilePhotoUploadModalProps
> = ({ onClose, onUploadSuccess }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

      <FileUpload
        file={imageFile}
        onChange={setImageFile}
        label="Upload a photo"
        replaceLabel="Upload another photo"
      />

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
