import { useState } from "react";
import type { PostCardContentProps } from '../../../types';
import { useImagePreview } from "../../../contexts/ImagePreviewContext";

export default function PostCardContent({ content, imageUrl, priority }: PostCardContentProps & { priority?: boolean }) {
  const [postImgError, setPostImgError] = useState(false);
  const { openPreview } = useImagePreview();

  return (
    <>
      {!(content && content.toLowerCase().includes("updated") && (content.toLowerCase().includes("cover") || content.toLowerCase().includes("profile") || content.toLowerCase().includes("photo") || content.toLowerCase().includes("picture"))) && content && (
        <div className="px-4 pb-3 pt-1">
          <p className="text-[#050505] dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      )}

      {imageUrl && imageUrl !== "undefined" && !postImgError && (
        <div 
          onClick={() => openPreview(imageUrl, content || "Post image")}
          className="w-full bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-700/60 overflow-hidden cursor-pointer group/postimg relative"
        >
          <img 
            src={imageUrl} 
            alt="Post content" 
            className="w-full max-h-[600px] object-cover transition-transform duration-300 group-hover/postimg:scale-[1.012]" 
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width="600"
            height="600"
            style={{ height: "auto", maxHeight: "600px" }} 
            onError={() => setPostImgError(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover/postimg:bg-black/5 transition-colors pointer-events-none" />
        </div>
      )}
    </>
  );
}
