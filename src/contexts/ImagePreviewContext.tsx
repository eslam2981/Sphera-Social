import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import ImagePreviewModal from "../components/ImagePreview/ImagePreviewModal";

interface ImagePreviewContextType {
  openPreview: (src: string, alt?: string) => void;
  closePreview: () => void;
}

export const ImagePreviewContext = createContext<ImagePreviewContextType | undefined>(undefined);

export function ImagePreviewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [alt, setAlt] = useState<string>("");

  const openPreview = (imageSrc: string, imageAlt: string = "") => {
    if (!imageSrc || imageSrc === "undefined") return;
    setSrc(imageSrc);
    setAlt(imageAlt);
    setIsOpen(true);
  };

  const closePreview = () => {
    setIsOpen(false);
  };

  return (
    <ImagePreviewContext.Provider value={{ openPreview, closePreview }}>
      {children}
      <ImagePreviewModal
        isOpen={isOpen}
        src={src}
        alt={alt}
        onClose={closePreview}
      />
    </ImagePreviewContext.Provider>
  );
}

export const useImagePreview = () => {
  const context = useContext(ImagePreviewContext);
  if (!context) throw new Error("useImagePreview must be used within an ImagePreviewProvider");
  return context;
};
