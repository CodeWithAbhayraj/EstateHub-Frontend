import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";

function PropertyGallery({ images = [], title = "Property" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  if (safeImages.length === 0) {
    return (
      <div className="surface flex h-[240px] w-full items-center justify-center sm:h-[360px] lg:h-[440px]">
        <div className="text-center text-slate-400">
          <ImageIcon size={28} className="mx-auto" />
          <p className="mt-3 text-sm">No images available</p>
        </div>
      </div>
    );
  }

  const nextImage = () =>
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));

  const previousImage = () =>
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));

  const navButtonClass =
    "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-card transition-colors hover:bg-white";

  return (
    <>
      {/* GALLERY */}
      <div className="surface overflow-hidden">
        {/* MAIN IMAGE */}
        <div className="relative aspect-[16/9] min-h-[220px] overflow-hidden bg-slate-100 sm:min-h-[340px] lg:min-h-[420px]">
          <img
            src={safeImages[activeIndex]}
            alt={`${title} ${activeIndex + 1}`}
            className="h-full w-full cursor-pointer object-cover"
            onClick={() => setShowLightbox(true)}
          />

          <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {activeIndex + 1} / {safeImages.length}
          </div>

          {safeImages.length > 1 && (
            <>
              <button type="button" onClick={previousImage} className={`${navButtonClass} left-3`} aria-label="Previous image">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={nextImage} className={`${navButtonClass} right-3`} aria-label="Next image">
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        {safeImages.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto p-3">
            {safeImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-24 ${
                  activeIndex === index ? "border-slate-900" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close image preview"
          >
            <X size={22} />
          </button>

          <div className="relative flex max-h-[90vh] max-w-6xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={safeImages[activeIndex]}
              alt={`${title} ${activeIndex + 1}`}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />

            {safeImages.length > 1 && (
              <>
                <button type="button" onClick={previousImage} className={`${navButtonClass} left-2 sm:left-4`} aria-label="Previous image">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={nextImage} className={`${navButtonClass} right-2 sm:right-4`} aria-label="Next image">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyGallery;