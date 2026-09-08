import { useEffect, useState } from "react";
import { Upload, Trash2, Image as ImageIcon, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import { uploadPropertyImage, getPropertyImages, deletePropertyImage } from "../../api/propertyImageApi";

export default function PropertyImageUpload({ propertyId }) {
  const MIN_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing images
  const loadImages = async () => {
    if (!propertyId) return;
    try {
      setLoadingImages(true);
      setError("");
      const data = await getPropertyImages(propertyId);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load images.");
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => { loadImages(); }, [propertyId]);

  const currentImageCount = images.length + selectedFiles.length;
  const minimumReached = images.length >= MIN_IMAGES || currentImageCount >= MIN_IMAGES;

  // File selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setError("");
    setSuccess("");
    if (files.length === 0) return;

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" exceeds 5 MB limit.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }

    if (validFiles.length === 0) {
      if (!error) setError("Please select valid image files.");
      e.target.value = "";
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  // Remove selected preview
  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      if (prev[index]?.url) URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
    setError("");
    setSuccess("");
  };

  // Clear all selected
  const clearSelectedFiles = () => {
    previews.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
    setSelectedFiles([]);
    setPreviews([]);
    setError("");
    setSuccess("");
  };

  // Upload all selected
  const handleUpload = async () => {
    if (!propertyId) return setError("Property ID is required.");
    if (selectedFiles.length === 0) return setError("Please select at least one image.");

    const totalAfterUpload = images.length + selectedFiles.length;
    if (totalAfterUpload < MIN_IMAGES) {
      const remaining = MIN_IMAGES - totalAfterUpload;
      return setError(`Please upload at least ${remaining} more image${remaining > 1 ? "s" : ""}. Minimum ${MIN_IMAGES} images required.`);
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedImages = [];
      for (const file of selectedFiles) {
        const uploaded = await uploadPropertyImage(propertyId, file);
        uploadedImages.push(uploaded);
      }

      setImages(prev => [...prev, ...uploadedImages]);
      previews.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
      setSelectedFiles([]);
      setPreviews([]);

      const finalCount = images.length + uploadedImages.length;
      setSuccess(`${uploadedImages.length} image${uploadedImages.length > 1 ? "s" : ""} uploaded. ${finalCount >= MIN_IMAGES ? `Minimum ${MIN_IMAGES} images satisfied.` : ""}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const handleDelete = async (imageId) => {
    if (!propertyId) return;
    if (images.length <= MIN_IMAGES) {
      return setError(`You must keep at least ${MIN_IMAGES} images.`);
    }
    try {
      setDeletingId(imageId);
      setError("");
      setSuccess("");
      await deletePropertyImage(propertyId, imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSuccess("Image deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => previews.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
  }, [previews]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon size={18} className="text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Property Images</h2>
          <span className="text-sm text-slate-500">({images.length}/{MIN_IMAGES} min)</span>
        </div>

        {/* Requirement status */}
        <div className={`mt-3 rounded-lg p-3 ${images.length >= MIN_IMAGES ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex items-start gap-2">
            {images.length >= MIN_IMAGES ? (
              <CheckCircle size={18} className="mt-0.5 text-green-600" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 text-amber-600" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {images.length >= MIN_IMAGES ? "✅ Minimum images satisfied" : `Minimum ${MIN_IMAGES} images required`}
              </p>
              <p className="text-xs text-slate-600">
                {images.length >= MIN_IMAGES
                  ? `You have ${images.length} images.`
                  : `${images.length} uploaded · ${Math.max(0, MIN_IMAGES - images.length)} more needed.`}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">PNG, JPG, WEBP · Max 5 MB each · Minimum {MIN_IMAGES} images.</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex items-start gap-2">
          <CheckCircle size={16} className="mt-0.5 shrink-0" /> {success}
        </div>
      )}

      {/* Upload area */}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-slate-400 hover:bg-slate-100 transition">
        <Upload size={28} className="mb-2 text-slate-400" />
        <span className="text-sm font-semibold text-slate-700">Choose images</span>
        <span className="text-xs text-slate-400">Click to browse · Multiple selection allowed</span>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} className="hidden" />
      </label>

      {/* Selected previews */}
      {previews.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-800">Selected ({previews.length})</h3>
            <button onClick={clearSelectedFiles} disabled={uploading} className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50">
              Clear all
            </button>
          </div>
          <div className="mb-2 text-sm text-slate-600">
            Total after upload: <span className={`font-bold ${currentImageCount >= MIN_IMAGES ? "text-green-600" : "text-red-600"}`}>{currentImageCount}</span> / {MIN_IMAGES} min
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((preview, index) => (
              <div key={preview.id} className="group relative overflow-hidden rounded-lg border border-slate-200">
                <img src={preview.url} alt={preview.name} className="h-32 w-full object-cover" />
                <button
                  onClick={() => removeSelectedFile(index)}
                  disabled={uploading}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 disabled:opacity-40 transition"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1.5">
                  <p className="truncate text-[10px] text-white">{preview.name}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading || !minimumReached}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
          {!minimumReached && (
            <p className="mt-1.5 text-xs text-red-600">
              Select {Math.max(0, MIN_IMAGES - images.length)} more image{Math.max(0, MIN_IMAGES - images.length) !== 1 ? "s" : ""}.
            </p>
          )}
        </div>
      )}

      {/* Existing images */}
      <div className="mt-6">
        <h3 className="text-sm font-bold text-slate-800 mb-2">Uploaded Images ({images.length})</h3>
        {loadingImages ? (
          <div className="flex min-h-24 items-center justify-center rounded-lg bg-slate-50">
            <Loader2 size={24} className="animate-spin text-slate-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
            <ImageIcon size={32} className="mx-auto mb-1 text-slate-300" />
            <p className="text-sm text-slate-500">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-lg border border-slate-200">
                <img src={img.imageUrl} alt="Property" className="h-36 w-full object-cover" />
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id || images.length <= MIN_IMAGES}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 disabled:opacity-40 transition"
                >
                  {deletingId === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={`mt-3 rounded-lg p-3 ${images.length >= MIN_IMAGES ? "bg-green-50" : "bg-yellow-50"}`}>
          <p className={`text-sm font-semibold ${images.length >= MIN_IMAGES ? "text-green-700" : "text-yellow-700"}`}>
            {images.length >= MIN_IMAGES
              ? `✅ ${MIN_IMAGES} images minimum satisfied.`
              : `⚠️ Upload ${MIN_IMAGES - images.length} more image${MIN_IMAGES - images.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>
    </div>
  );
}