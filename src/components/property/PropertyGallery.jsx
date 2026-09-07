import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
} from "lucide-react";

function PropertyGallery({
  images = [],
  title = "Property",
}) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const [showLightbox, setShowLightbox] =
    useState(false);

  const safeImages = Array.isArray(images)
    ? images.filter(Boolean)
    : [];

  // ==========================================
  // NO IMAGES
  // ==========================================

  if (safeImages.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[380px] lg:h-[460px]">
        <div className="text-center text-slate-400">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
            <ImageIcon size={28} />
          </div>

          <p className="mt-3 text-sm font-medium">
            No images available
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NEXT IMAGE
  // ==========================================

  const nextImage = () => {
    setActiveIndex((prev) =>
      prev === safeImages.length - 1
        ? 0
        : prev + 1
    );
  };

  // ==========================================
  // PREVIOUS IMAGE
  // ==========================================

  const previousImage = () => {
    setActiveIndex((prev) =>
      prev === 0
        ? safeImages.length - 1
        : prev - 1
    );
  };

  return (
    <>
      {/* ==========================================
          GALLERY
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* MAIN IMAGE */}

        <div className="relative aspect-[16/9] min-h-[240px] overflow-hidden bg-slate-100 sm:min-h-[360px] lg:aspect-[16/8] lg:min-h-[440px]">

          <img
            src={safeImages[activeIndex]}
            alt={`${title} ${activeIndex + 1}`}
            className="h-full w-full object-cover"
            onClick={() =>
              setShowLightbox(true)
            }
          />

          {/* IMAGE COUNTER */}

          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {activeIndex + 1} /{" "}
            {safeImages.length}
          </div>

          {/* PREVIOUS */}

          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 sm:left-4 sm:h-11 sm:w-11"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* NEXT */}

          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 sm:right-4 sm:h-11 sm:w-11"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          )}

        </div>

        {/* ==========================================
            THUMBNAILS
        ========================================== */}

        {safeImages.length > 1 && (
          <div className="overflow-x-auto p-3 sm:p-4">
            <div className="flex gap-3">

              {safeImages.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    className={`
                      relative
                      h-16
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border-2
                      transition-all
                      duration-200
                      sm:h-20
                      sm:w-24
                      ${
                        activeIndex === index
                          ? "border-slate-900 ring-2 ring-slate-100"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }
                    `}
                    aria-label={`View image ${
                      index + 1
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${
                        index + 1
                      }`}
                      className="h-full w-full object-cover"
                    />

                    {activeIndex ===
                      index && (
                      <div className="absolute inset-0 bg-black/10" />
                    )}
                  </button>
                )
              )}

            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          LIGHTBOX
      ========================================== */}

      {showLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() =>
            setShowLightbox(false)
          }
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={() =>
              setShowLightbox(false)
            }
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Close image preview"
          >
            <X size={22} />
          </button>

          {/* IMAGE */}

          <div
            className="relative flex max-h-[90vh] max-w-6xl items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={safeImages[activeIndex]}
              alt={`${title} ${
                activeIndex + 1
              }`}
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            {/* LIGHTBOX PREVIOUS */}

            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg sm:left-4"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* LIGHTBOX NEXT */}

            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg sm:right-4"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            )}

          </div>

        </div>
      )}
    </>
  );
}

export default PropertyGallery;