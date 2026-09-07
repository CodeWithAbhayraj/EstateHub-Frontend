import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
  open,
  onClose,
  title = "Modal",
  children,
  size = "md",
}) {
  // ==========================================
  // CLOSE ON ESC
  // ==========================================

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  // ==========================================
  // LOCK BODY SCROLL
  // ==========================================

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  // ==========================================
  // CLOSED
  // ==========================================

  if (!open) {
    return null;
  }

  // ==========================================
  // SIZE
  // ==========================================

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        overflow-y-auto
        bg-slate-950/50
        p-4
        backdrop-blur-[2px]
        sm:p-6
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          relative
          flex
          max-h-[90vh]
          w-full
          ${sizeClasses[size] || sizeClasses.md}
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-200
        `}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-5
            py-4
            sm:px-6
          "
        >
          <h2
            id="modal-title"
            className="
              min-w-0
              truncate
              pr-4
              text-lg
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              duration-200
              hover:bg-slate-100
              hover:text-slate-900
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-400
              focus-visible:ring-offset-2
            "
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;