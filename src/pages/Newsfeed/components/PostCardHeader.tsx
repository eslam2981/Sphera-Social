import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { User, Globe, MoreHorizontal, Bookmark, Edit2, Trash2, Repeat2, Lock } from "lucide-react";
import type { PostCardHeaderProps } from '../../../types';
export default function PostCardHeader({
  postId,
  authorId,
  authorName,
  authorPhoto,
  timeAgo,
  content,
  currentUserId,
  onDeleteClick,
  onEditClick,
  hideOptions,
  isRepostHeader
}: PostCardHeaderProps) {
    const [imgError, setImgError] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-start px-4 pt-3 pb-2 gap-2">
      <div className="flex gap-2 items-center min-w-0 flex-1">
        <div className="relative">
          <RouterLink to={`/user/${authorId}`} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer hover:brightness-95 transition-all block">
            {authorPhoto && authorPhoto !== "undefined" && !authorPhoto.toLowerCase().includes('default') && !imgError ? (
              <img 
                src={authorPhoto} 
                alt={authorName} 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              <User size={24} className="text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            )}
          </RouterLink>
          {isRepostHeader && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm border border-slate-200 dark:border-slate-700">
              <Repeat2 size={12} className="text-[#00298D] dark:text-blue-400" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <RouterLink to={`/user/${authorId}`} className="font-semibold text-[#050505] dark:text-white text-[15px] hover:underline cursor-pointer leading-tight truncate block">
              {authorName}
            </RouterLink>
            
            {content && content.toLowerCase().includes("updated") && (content.toLowerCase().includes("cover") || content.toLowerCase().includes("profile") || content.toLowerCase().includes("photo") || content.toLowerCase().includes("picture")) && (
              <span className="text-slate-500 dark:text-slate-400 text-[13px] sm:text-[14px] font-normal truncate">
                {(() => {
                  const lower = content.toLowerCase();
                  if (lower.includes("cover")) {
                    return "updated their cover photo";
                  }
                  if (lower.includes("profile")) {
                    return "updated their profile picture";
                  }
                  return content.replace(/\.?\d+$/, "").trim();
                })()}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-[#65676b] dark:text-gray-400 text-[13px] mt-0.5 gap-1 min-w-0 flex-wrap">
            <span className="hover:underline cursor-pointer shrink-0">{timeAgo}</span>
            <span className="text-[#65676b] dark:text-gray-400 shrink-0 font-bold px-0.5">·</span>
            <span className="flex items-center gap-1 text-[#65676b] dark:text-gray-400 shrink-0">
              <Globe size={12} strokeWidth={1.5} />
              <span>Public</span>
            </span>
          </div>
        </div>
      </div>
      
      {!hideOptions && (
        <div className="flex items-center">
          {postId && (
            <RouterLink 
              to={`/post/${postId}`} 
              className="text-[#00298D] dark:text-blue-400 hover:underline text-[11px] sm:text-sm font-medium mr-1 sm:mr-2 whitespace-nowrap shrink-0"
            >
              View details
            </RouterLink>
          )}
          <div className="relative" ref={optionsRef}>
            <button 
              aria-label="More options"
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className="cursor-pointer text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full transition-colors outline-none"
            >
              <MoreHorizontal size={20} strokeWidth={1.5} />
            </button>
        
        {isOptionsOpen && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-lg shadow-lg py-1 z-50">
            <button 
              onClick={() => setIsOptionsOpen(false)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors"
            >
              <Bookmark size={16} className="text-slate-500 dark:text-slate-400" /> Save post
            </button>
            
            {currentUserId === authorId && (
              <>
                <button 
                  onClick={() => {
                    setIsOptionsOpen(false);
                    onEditClick?.();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <Edit2 size={16} className="text-slate-500 dark:text-slate-400" /> Edit post
                </button>
                <button 
                  onClick={() => setIsOptionsOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <Lock size={16} className="text-slate-500 dark:text-slate-400" /> Edit privacy
                </button>
                <button 
                  onClick={() => {
                    setIsOptionsOpen(false);
                    onDeleteClick();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-3 cursor-pointer transition-colors"
                >
                  <Trash2 size={16} className="text-red-500 dark:text-red-400" /> Delete post
                </button>
              </>
            )}
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
}
