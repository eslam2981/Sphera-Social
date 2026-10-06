import { User, Loader2, Image as ImageIcon, Smile, Send, X } from "lucide-react";
import { useContext, useRef } from "react";
import CommentItem from "./CommentItem";
import { UserDataContext } from "../../../contexts/UserData";
import type { Comment } from "../../../types";
import type { CommentsSectionProps } from '../../../types';

/** Renders the comments section component. */
export default function CommentsSection({
  isCommentsOpen,
  isLoadingComments,
  commentsList,
  topComment,
  currentUserId,
  newCommentText,
  setNewCommentText,
  commentImage,
  setCommentImage,
  handleAddComment,
  isSubmittingComment,
  handleDeleteComment,
  handleEditComment,
  handleLikeComment,
  onCommentToggle,
  commentsCount
}: CommentsSectionProps) {
  const { Data } = useContext(UserDataContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <>
      {/* Show top comment when closed */}
      {!isCommentsOpen && topComment && (
        <div className="px-4 pb-3 pt-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60">
          <CommentItem 
            comment={topComment} 
            currentUserId={currentUserId} 
            onDelete={() => handleDeleteComment(topComment._id)}
            onEdit={(newContent) => handleEditComment(topComment._id, newContent)}
            onLike={() => handleLikeComment(topComment._id)}
          />
          {commentsCount && commentsCount > 1 && (
            <button 
              onClick={onCommentToggle}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-[15px] font-medium mt-3 transition-colors cursor-pointer w-full text-left pl-1"
            >
              View all {commentsCount} comments
            </button>
          )}
        </div>
      )}

      {/* Main Comments Section */}
      <div className={`grid transition-all duration-300 ease-in-out ${isCommentsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        <div className="px-4 py-2 bg-white dark:bg-slate-900">
          <div className="relative">
            {}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isLoadingComments ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 pointer-events-none'}`}>
              <div className="space-y-4 py-2 mt-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-2 animate-pulse">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#e4e6e9] dark:bg-slate-800 shrink-0"></div>
                    <div className="flex-1">
                      <div className="bg-[#e4e6e9] dark:bg-slate-800 h-[72px] rounded-2xl w-full max-w-[70%]"></div>
                      <div className="flex gap-3 mt-1.5 ml-3">
                        <div className="bg-[#e4e6e9] dark:bg-slate-800 h-3 w-8 rounded"></div>
                        <div className="bg-[#e4e6e9] dark:bg-slate-800 h-3 w-12 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!isLoadingComments ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0 pointer-events-none'}`}>
              <div className="space-y-2 mt-1 pr-1">
                {Array.isArray(commentsList) && commentsList.length > 0 ? (
                  commentsList.map((comment: Comment) => (
                    <CommentItem 
                      key={comment._id} 
                      comment={comment} 
                      currentUserId={currentUserId} 
                      onDelete={() => handleDeleteComment(comment._id)}
                      onEdit={(newContent) => handleEditComment(comment._id, newContent)}
                      onLike={() => handleLikeComment(comment._id)}
                    />
                  ))
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-4">
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {}
          <div className="flex gap-3 mt-5 items-start">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer">
               {(() => {
                 const photo = Data?.photo;
                 const name = Data?.name;
                 if (photo && !photo.includes('default')) {
                   return <img src={photo} alt={name || "User"} className="w-full h-full object-cover" />;
                 }
                 return <User size={20} className="text-slate-400 dark:text-slate-500" />;
               })()}
             </div>
             <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-400/20 rounded-[20px] px-4 py-2 flex flex-col relative transition-all shadow-sm">
               
               {commentImage && (
                 <div className="relative mb-2 mt-1 w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                   <img src={URL.createObjectURL(commentImage)} alt="Preview" className="w-full h-full object-cover" />
                   <button 
                     onClick={() => setCommentImage && setCommentImage(null)}
                     className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                   >
                     <X size={14} />
                   </button>
                 </div>
               )}

               <textarea 
                 placeholder={(() => {
                   const name = Data?.name;
                   if (name) {
                     return `Comment as ${name.split(' ')[0]}...`;
                   }
                   return "Comment...";
                 })()}
                 value={newCommentText}
                 onChange={(e) => {
                   setNewCommentText(e.target.value);
                   e.target.style.height = 'auto';
                   e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                 }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleAddComment();
                   }
                 }}
                 disabled={isSubmittingComment}
                 className="w-full bg-transparent border-none p-0 text-[15px] text-slate-800 dark:text-gray-100 focus:ring-0 focus:outline-none resize-none min-h-[22px] max-h-[120px] disabled:opacity-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 leading-relaxed"
                 rows={1}
               />
               
               <div className="flex justify-between items-center mt-2 px-1">
                 <div className="flex items-center gap-1.5">
                   <button 
                     aria-label="Add image" 
                     onClick={() => fileInputRef.current?.click()}
                     className="text-[#65676b] dark:text-gray-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 p-1.5 rounded-full transition-colors cursor-pointer"
                   >
                     <ImageIcon size={18} strokeWidth={2} />
                   </button>
                   <input 
                     type="file" 
                     ref={fileInputRef}
                     accept="image/*"
                     className="hidden"
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file && setCommentImage) {
                         setCommentImage(file);
                       }
                     }}
                   />
                   <button aria-label="Add emoji" className="text-[#65676b] dark:text-gray-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 p-1.5 rounded-full transition-colors cursor-pointer">
                     <Smile size={18} strokeWidth={2} />
                   </button>
                 </div>
                 
                 <button 
                    aria-label="Submit comment"
                    onClick={handleAddComment}
                   disabled={(!newCommentText.trim() && !commentImage) || isSubmittingComment}
                   className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all ${
                     (newCommentText.trim() || commentImage) && !isSubmittingComment 
                       ? 'text-[#1877f2] dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer' 
                       : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                   }`}
                 >
                   {isSubmittingComment ? (
                     <Loader2 size={16} className="animate-spin" />
                   ) : (
                     <Send size={16} className="-ml-0.5 mt-0.5" strokeWidth={2} />
                   )}
                 </button>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}