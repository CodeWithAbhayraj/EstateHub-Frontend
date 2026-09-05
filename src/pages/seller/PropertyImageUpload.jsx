import { useEffect, useState } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

import {
  uploadPropertyImage,
  getPropertyImages,
  deletePropertyImage,
} from "../../api/propertyImageApi";

function PropertyImageUpload({ propertyId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [images, setImages] = useState([]);

  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD EXISTING IMAGES
  // ==========================================

  const loadImages = async () => {
    if (!propertyId) return;

    try {
      setLoadingImages(true);
      setError("");

      const data = await getPropertyImages(propertyId);

      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load property images error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load property images."
      );
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [propertyId]);

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    setError("");
    setSuccess("");

    if (files.length === 0) {
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Image validation
      if (!file.type.startsWith("image/")) {
        setError(
          `"${file.name}" is not a valid image file.`
        );
        continue;
      }

      // 5 MB validation
      if (file.size > 5 * 1024 * 1024) {
        setError(
          `"${file.name}" exceeds the 5 MB limit.`
        );
        continue;
      }

      validFiles.push(file);

      newPreviews.push({
        id:
          `${file.name}-${file.size}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }

    setSelectedFiles(validFiles);
    setPreviews(newPreviews);

    // Reset input
    e.target.value = "";
  };

  // ==========================================
  // REMOVE SELECTED PREVIEW
  // ==========================================

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviews((prev) => {
      const selectedPreview = prev[index];

      if (selectedPreview?.url) {
        URL.revokeObjectURL(
          selectedPreview.url
        );
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // ==========================================
  // UPLOAD ALL SELECTED FILES
  // ==========================================

  const handleUpload = async () => {
    if (!propertyId) {
      setError("Property ID is required.");
      return;
    }

    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedImages = [];

      for (const file of selectedFiles) {
        const uploadedImage =
          await uploadPropertyImage(
            propertyId,
            file
          );

        uploadedImages.push(uploadedImage);
      }

      setImages((prev) => [
        ...prev,
        ...uploadedImages,
      ]);

      // Clear selected files
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });

      setSelectedFiles([]);
      setPreviews([]);

      setSuccess(
        `${uploadedImages.length} image${
          uploadedImages.length > 1 ? "s" : ""
        } uploaded successfully.`
      );
    } catch (err) {
      console.error("Upload image error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // DELETE IMAGE
  // ==========================================

  const handleDelete = async (imageId) => {
    if (!propertyId) return;

    try {
      setDeletingId(imageId);
      setError("");
      setSuccess("");

      await deletePropertyImage(
        propertyId,
        imageId
      );

      setImages((prev) =>
        prev.filter(
          (image) => image.id !== imageId
        )
      );

      setSuccess(
        "Image deleted successfully."
      );
    } catch (err) {
      console.error("Delete image error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete image."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // CLEANUP PREVIEW URLS
  // ==========================================

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [previews]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <ImageIcon
              size={20}
              className="text-blue-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Property Images
            </h2>

            <p className="text-sm text-slate-500">
              Upload images for your property.
            </p>
          </div>

        </div>

        <p className="mt-3 text-xs text-slate-400">
          Only image files are allowed. Maximum size: 5 MB per image.
        </p>

      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ==========================================
          SUCCESS
      ========================================== */}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ==========================================
          FILE SELECT
      ========================================== */}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100">

        <Upload
          size={30}
          className="mb-3 text-slate-500"
        />

        <span className="text-sm font-semibold text-slate-700">
          Choose property images
        </span>

        <span className="mt-1 text-xs text-slate-400">
          PNG, JPG, JPEG, WEBP up to 5 MB
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

      </label>

      {/* ==========================================
          SELECTED IMAGE PREVIEWS
      ========================================== */}

      {previews.length > 0 && (
        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <h3 className="text-sm font-bold text-slate-800">
              Selected Images ({previews.length})
            </h3>

            <button
              type="button"
              onClick={() => {
                previews.forEach((preview) => {
                  if (preview.url) {
                    URL.revokeObjectURL(
                      preview.url
                    );
                  }
                });

                setSelectedFiles([]);
                setPreviews([]);
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear All
            </button>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

            {previews.map((preview, index) => (

              <div
                key={preview.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200"
              >

                <img
                  src={preview.url}
                  alt={preview.name}
                  className="h-36 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeSelectedFile(index)
                  }
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={16} />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-2">
                  <p className="truncate text-xs text-white">
                    {preview.name}
                  </p>
                </div>

              </div>

            ))}

          </div>

          {/* Upload button */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={17} />
                Upload Images
              </>
            )}
          </button>

        </div>
      )}

      {/* ==========================================
          EXISTING IMAGES
      ========================================== */}

      <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Uploaded Images
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {images.length} image
              {images.length !== 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {loadingImages ? (

          <div className="flex min-h-32 items-center justify-center rounded-xl bg-slate-50">

            <Loader2
              size={24}
              className="animate-spin text-slate-500"
            />

          </div>

        ) : images.length === 0 ? (

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">

            <ImageIcon
              size={32}
              className="mx-auto mb-2 text-slate-300"
            />

            <p className="text-sm text-slate-500">
              No images uploaded yet.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

            {images.map((image) => (

              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200"
              >

                <img
                  src={image.imageUrl}
                  alt={`Property ${propertyId}`}
                  className="h-40 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(image.id)
                  }
                  disabled={
                    deletingId === image.id
                  }
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                >

                  {deletingId === image.id ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={15} />
                  )}

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default PropertyImageUpload;