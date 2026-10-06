import { ThumbsUp } from "lucide-react";
import type { PostCardStatsProps } from '../../../types';

/** Renders the post card stats component. */
export default function PostCardStats({ likesCount, commentsCount, sharesCount }: PostCardStatsProps) {
  if (likesCount === 0 && commentsCount === 0 && sharesCount === 0) {
    return null; 
  }

  return (
    <div className="flex items-center justify-between text-[#65676b] dark:text-gray-400 text-[15px] py-2.5 px-4 mx-4 border-b border-[#ced0d4] dark:border-slate-700">
      <div className="flex items-center gap-1.5 cursor-pointer hover:underline group shrink-0">
        {likesCount > 0 && (
          <>
            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors bg-gradient-to-b from-[#1877f2] to-[#2851a3] text-white`}>
              <ThumbsUp size={10} className="fill-white" strokeWidth={3} />
            </div>
            <span className="hover:underline">{likesCount}</span>
          </>
        )}
      </div>

      <div className="flex gap-3 items-center shrink-0">
        {commentsCount > 0 && (
          <div className="flex items-center cursor-pointer hover:underline transition-colors whitespace-nowrap">
            <span>{commentsCount} <span className="inline">{commentsCount === 1 ? 'comment' : 'comments'}</span></span>
          </div>
        )}
        {sharesCount > 0 && (
          <div className="flex items-center cursor-pointer hover:underline transition-colors whitespace-nowrap">
            <span>{sharesCount} <span className="inline">{sharesCount === 1 ? 'share' : 'shares'}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
