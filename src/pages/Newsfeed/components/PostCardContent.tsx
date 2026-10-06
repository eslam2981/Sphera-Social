import { useState } from "react";
import type { PostCardContentProps } from '../../../types';

/** Renders the post card content component. */
export default function PostCardContent({ content, imageUrl, priority }: PostCardContentProps & { priority?: boolean }) {
    const [postImgError, setPostImgError] = useState(false);

  return (
    <>
      {!(content && content.toLowerCase().includes("updated") && (content.toLowerCase().includes("profile picture") || content.toLowerCase().includes("cover photo"))) && content && (
        <div className="px-4 pb-3 pt-1">
          <p className="text-[#050505] dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      )}

      {imageUrl && imageUrl !== "undefined" && !postImgError && (
        <div className="w-full bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-700/60">
          <img 
            src={imageUrl} 
            alt="Post content" 
            className="w-full max-h-[600px] object-cover" 
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            width="600"
            height="600"
            style={{ height: "auto", maxHeight: "600px" }} 
            onError={() => setPostImgError(true)}
          />
        </div>
      )}
    </>
  );
}
