import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import type { PostCardActionsProps } from '../../../types';

/** Renders the post card actions component. */
export default function PostCardActions({ liked, onLike, onCommentToggle, onShare }: PostCardActionsProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1">
      <button 
        onClick={onLike}
        className={`flex-1 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#f2f2f2] dark:hover:bg-slate-800 py-1.5 rounded-md transition-colors group ${
          liked ? 'text-[#1877f2] dark:text-blue-500' : 'text-[#65676b] dark:text-gray-300'
        }`}
      >
        <ThumbsUp size={20} className={`transform group-active:scale-90 transition-transform ${liked ? 'fill-[#1877f2]' : ''}`} strokeWidth={liked ? 2.5 : 2} />
        <span className="font-semibold text-[15px]">Like</span>
      </button>
      
      <button 
        onClick={onCommentToggle}
        className="flex-1 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#f2f2f2] dark:hover:bg-slate-800 py-1.5 rounded-md transition-colors group text-[#65676b] dark:text-gray-300">
        <MessageCircle size={20} className="shrink-0 transition-colors" strokeWidth={2} />
        <span className="text-[15px] font-semibold transition-colors whitespace-nowrap">Comment</span>
      </button>
      
      <button 
        onClick={onShare}
        className="flex-1 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#f2f2f2] dark:hover:bg-slate-800 py-1.5 rounded-md transition-colors group text-[#65676b] dark:text-gray-300"
      >
        <Share2 size={20} className="shrink-0 transition-colors" strokeWidth={2} />
        <span className="text-[15px] font-semibold transition-colors whitespace-nowrap">Share</span>
      </button>
    </div>
  );
}
