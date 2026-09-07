import { useEffect, useState } from "react";

import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import {
  uploadPropertyImage,
  getPropertyImages,
  deletePropertyImage,
} from "../../api/propertyImageApi";

function PropertyImageUpload({ propertyId }) {
  const MIN_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [images, setImages] = useState([]);

  const [loadingImages, setLoadingImages] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD EXISTING IMAGES
  // ==========================================

  const loadImages = async () => {
    if (!propertyId) {
      return;
    }

    try {
      setLoadingImages(true);
      setError("");

      const data =
        await getPropertyImages(propertyId);

      setImages(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Load property images error:",
        err
      );

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
  // CURRENT IMAGE COUNT
  // ==========================================

  const currentImageCount =
    images.length + selectedFiles.length;

  const minimumReached =
    images.length >= MIN_IMAGES ||
    currentImageCount >= MIN_IMAGES;

  const remainingImages = Math.max(
    0,
    MIN_IMAGES - images.length
  );

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    setError("");
    setSuccess("");

    if (files.length === 0) {
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    // Maximum files still needed
    const maxFilesNeeded =
      Math.max(
        0,
        MIN_IMAGES - images.length
      );

    /*
     * We don't force exactly 5.
     * Seller can upload more than 5.
     *
     * Example:
     * existing = 3
     * selected = 5
     * total = 8 ✅
     */

    for (const file of files) {

      // Image validation
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // File size validation
      if (file.size > MAX_FILE_SIZE) {
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

    if (validFiles.length === 0) {
      if (!error) {
        setError(
          "Please select valid image files."
        );
      }

      e.target.value = "";
      return;
    }

    /*
     * Add to existing selected files
     * instead of replacing them.
     */

    setSelectedFiles((prev) => [
      ...prev,
      ...validFiles,
    ]);

    setPreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    e.target.value = "";
  };

  // ==========================================
  // REMOVE SELECTED PREVIEW
  // ==========================================

  const removeSelectedFile = (index) => {

    setSelectedFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    setPreviews((prev) => {

      const selectedPreview =
        prev[index];

      if (selectedPreview?.url) {
        URL.revokeObjectURL(
          selectedPreview.url
        );
      }

      return prev.filter(
        (_, i) => i !== index
      );
    });

    setError("");
    setSuccess("");
  };

  // ==========================================
  // CLEAR SELECTED FILES
  // ==========================================

  const clearSelectedFiles = () => {

    previews.forEach((preview) => {
      if (preview.url) {
        URL.revokeObjectURL(
          preview.url
        );
      }
    });

    setSelectedFiles([]);
    setPreviews([]);

    setError("");
    setSuccess("");
  };

  // ==========================================
  // UPLOAD ALL SELECTED FILES
  // ==========================================

  const handleUpload = async () => {

    if (!propertyId) {
      setError(
        "Property ID is required."
      );
      return;
    }

    if (selectedFiles.length === 0) {
      setError(
        "Please select at least one image."
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * We check total images BEFORE upload.
     *
     * Existing images + selected images
     * must be at least 5.
     */

    const totalAfterUpload =
      images.length +
      selectedFiles.length;

    if (totalAfterUpload < MIN_IMAGES) {
      const remaining =
        MIN_IMAGES -
        totalAfterUpload;

      setError(
        `Please upload at least ${remaining} more image${
          remaining > 1 ? "s" : ""
        }. Minimum ${MIN_IMAGES} images are required.`
      );

      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedImages = [];

      /*
       * Upload one image at a time.
       * This matches the backend endpoint.
       */

      for (const file of selectedFiles) {

        const uploadedImage =
          await uploadPropertyImage(
            propertyId,
            file
          );

        uploadedImages.push(
          uploadedImage
        );
      }

      setImages((prev) => [
        ...prev,
        ...uploadedImages,
      ]);

      // Clear previews
      previews.forEach((preview) => {
        if (preview.url) {
          URL.revokeObjectURL(
            preview.url
          );
        }
      });

      setSelectedFiles([]);
      setPreviews([]);

      const finalCount =
        images.length +
        uploadedImages.length;

      setSuccess(
        `${uploadedImages.length} image${
          uploadedImages.length > 1
            ? "s"
            : ""
        } uploaded successfully. ${
          finalCount >= MIN_IMAGES
            ? `Minimum ${MIN_IMAGES} images requirement is satisfied.`
            : ""
        }`
      );

    } catch (err) {

      console.error(
        "Upload image error:",
        err
      );

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

  const handleDelete = async (
    imageId
  ) => {

    if (!propertyId) {
      return;
    }

    /*
     * Prevent deleting if that would
     * bring total below 5.
     */

    if (images.length <= MIN_IMAGES) {

      setError(
        `You must keep at least ${MIN_IMAGES} images for this property.`
      );

      return;
    }

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
          (image) =>
            image.id !== imageId
        )
      );

      setSuccess(
        "Image deleted successfully."
      );

    } catch (err) {

      console.error(
        "Delete image error:",
        err
      );

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
          URL.revokeObjectURL(
            preview.url
          );
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


        {/* IMAGE REQUIREMENT */}

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">

          <div className="flex items-start gap-3">

            {minimumReached ? (
              <CheckCircle
                size={20}
                className="mt-0.5 text-green-600"
              />
            ) : (
              <AlertCircle
                size={20}
                className="mt-0.5 text-blue-600"
              />
            )}

            <div>

              <p className="text-sm font-semibold text-slate-800">
                Minimum {MIN_IMAGES} images required
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {images.length >= MIN_IMAGES
                  ? `You have uploaded ${images.length} images.`
                  : `You have ${images.length} uploaded image${
                      images.length !== 1
                        ? "s"
                        : ""
                    }. ${
                      remainingImages
                    } more image${
                      remainingImages !== 1
                        ? "s"
                        : ""
                    } required.`}
              </p>

            </div>

          </div>

        </div>


        <p className="mt-3 text-xs text-slate-400">
          Only image files are allowed.
          Maximum size: 5 MB per image.
          Minimum {MIN_IMAGES} images required.
        </p>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

        </div>
      )}


      {/* ==========================================
          SUCCESS
      ========================================== */}

      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">

          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>

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

        <span className="mt-2 text-xs font-semibold text-blue-600">
          You can select multiple images
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
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
              onClick={clearSelectedFiles}
              disabled={uploading}
              className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Clear All
            </button>

          </div>


          <div className="mb-4 rounded-xl bg-slate-50 p-3">

            <p className="text-sm text-slate-600">

              Total after upload:

              <span
                className={`ml-1 font-bold ${
                  currentImageCount >=
                  MIN_IMAGES
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {currentImageCount}
              </span>

              <span className="text-slate-400">
                {" "}
                / {MIN_IMAGES} minimum
              </span>

            </p>

          </div>


          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

            {previews.map(
              (preview, index) => (

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
                      removeSelectedFile(
                        index
                      )
                    }
                    disabled={uploading}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                    aria-label="Remove selected image"
                  >
                    <X size={16} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-2">

                    <p className="truncate text-xs text-white">
                      {preview.name}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>


          {/* UPLOAD BUTTON */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={
              uploading ||
              !minimumReached
            }
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


          {!minimumReached && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Select at least{" "}
              {Math.max(
                0,
                MIN_IMAGES -
                  images.length
              )}{" "}
              more image
              {Math.max(
                0,
                MIN_IMAGES -
                  images.length
              ) !== 1
                ? "s"
                : ""}{" "}
              before uploading.
            </p>
          )}

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
              {images.length !== 1
                ? "s"
                : ""}

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

            <p className="mt-1 text-xs text-red-500">
              Minimum {MIN_IMAGES} images are required.
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
                    handleDelete(
                      image.id
                    )
                  }
                  disabled={
                    deletingId ===
                      image.id ||
                    images.length <=
                      MIN_IMAGES
                  }
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Delete image"
                >

                  {deletingId ===
                  image.id ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2
                      size={15}
                    />
                  )}

                </button>

              </div>

            ))}

          </div>

        )}


        {/* FINAL STATUS */}

        <div
          className={`mt-5 rounded-xl p-4 ${
            images.length >= MIN_IMAGES
              ? "bg-green-50"
              : "bg-yellow-50"
          }`}
        >

          <div className="flex items-center gap-2">

            {images.length >=
            MIN_IMAGES ? (
              <CheckCircle
                size={18}
                className="text-green-600"
              />
            ) : (
              <AlertCircle
                size={18}
                className="text-yellow-600"
              />
            )}

            <p
              className={`text-sm font-semibold ${
                images.length >=
                MIN_IMAGES
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {images.length >=
              MIN_IMAGES
                ? `Minimum ${MIN_IMAGES} images requirement satisfied.`
                : `Upload ${
                    MIN_IMAGES -
                    images.length
                  } more image${
                    MIN_IMAGES -
                      images.length !==
                    1
                      ? "s"
                      : ""
                  }.`}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PropertyImageUpload;