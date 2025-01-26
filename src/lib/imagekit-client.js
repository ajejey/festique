'use client';

import { IKUpload } from "imagekitio-next";
import { imagekitAuth } from "@/app/organize/actions";

export function ImageKitUploader({ 
  onSuccess, 
  onError, 
  folder = 'events',
  className 
}) {
  const handleUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      // Get authentication parameters from server
      const authParams = await imagekitAuth();

      // Configure upload options
      const uploadOptions = {
        authenticator: async () => authParams,
        folder: `/festique/${folder}`,
        tags: ['festique-upload']
      };

      return uploadOptions;
    } catch (error) {
      console.error("ImageKit Upload Setup Error:", error);
      onError?.(error);
    }
  };

  return (
    <IKUpload 
      className={className}
      onError={onError}
      onSuccess={onSuccess}
      getAuthenticationParams={handleUpload}
    />
  );
}
