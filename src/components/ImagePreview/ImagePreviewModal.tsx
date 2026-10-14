import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ExternalLink, 
  RotateCcw
} from "lucide-react";

interface ImagePreviewModalProps {
  isOpen: boolean;
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ isOpen, src, alt, onClose }: ImagePreviewModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset state on open/change
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, src]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.35, 3.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.35, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setRotation(0);
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!src) return;
    try {
      const response = await fetch(src, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sphera-photo-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback direct download
      const link = document.createElement("a");
      link.href = src;
      link.target = "_blank";
      link.download = "sphera-image";
      link.rel = "noreferrer noopener";
      link.click();
    }
  }, [src]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleReset();
      } else if (e.key.toLowerCase() === "r") {
        handleRotate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleZoomIn, handleZoomOut, handleReset, handleRotate]);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => (prev > 1 ? 1 : 2));
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] bg-black/92 backdrop-blur-xl flex flex-col items-center justify-between select-none overflow-hidden"
          onWheel={handleWheel}
        >
          {/* Top toolbar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between px-4 sm:px-6 py-4 z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
          >
            {/* Title / Description */}
            <div className="flex items-center gap-3 max-w-[50%] min-w-0">
              <span className="text-white/80 font-medium text-sm truncate">
                {alt || "Photo Preview"}
              </span>
              {scale !== 1 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-blue-300 border border-white/10">
                  {Math.round(scale * 100)}%
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out (-)"
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <ZoomOut size={18} />
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In (+)"
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <ZoomIn size={18} />
              </button>

              {(scale !== 1 || rotation !== 0) && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset (0)"
                  className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
                >
                  <RotateCcw size={18} />
                </button>
              )}

              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90° (R)"
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <RotateCw size={18} />
              </button>

              <button
                type="button"
                onClick={handleDownload}
                title="Download Photo"
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <Download size={18} />
              </button>

              <a
                href={src}
                target="_blank"
                rel="noreferrer noopener"
                title="Open Original"
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <ExternalLink size={18} />
              </a>

              <div className="w-[1px] h-5 bg-white/20 mx-1"></div>

              <button
                type="button"
                onClick={onClose}
                title="Close (Esc)"
                className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-red-500/80 text-white transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image viewport area */}
          <div className="w-full flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={src}
                alt={alt || "Preview"}
                drag={scale > 1}
                dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                dragElastic={0.1}
                onClick={handleImageClick}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className={`max-w-[95vw] max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl ${
                  scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                }`}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Bottom hint caption */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full text-center pb-4 pt-2 z-50 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          >
            <p className="text-white/40 text-xs tracking-wide">
              Click photo to {scale > 1 ? "zoom out" : "zoom in"} · Scroll wheel to zoom · Press Esc to exit
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
