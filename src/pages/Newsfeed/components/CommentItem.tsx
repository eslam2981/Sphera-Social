import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { User, MoreHorizontal, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { formatTimeAgo } from "../../../utils/dateUtils";
import type { CommentItemProps } from '../../../types';

/** Renders the comment item component. */
export default function CommentItem({ comment, currentUserId, onDelete, onEdit, onLike }: CommentItemProps) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      const length = editInputRef.current.value.length;
      editInputRef.current.setSelectionRange(length, length);
      editInputRef.current.style.height = 'auto';
      editInputRef.current.style.height = editInputRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  /** Handles the edit confirm action. */
    const handleEditConfirm = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    
    setIsSubmittingEdit(true);
    try {
      await onEdit(editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit comment", error);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  /** Handles the key down action. */
    const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditConfirm();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(comment.content);
    }
  };

  /** Handles the confirm delete action. */
    const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };
  
  const commentUser: any = comment?.commentCreator || comment?.user || {};
  const isAuthor = String(currentUserId) === String(commentUser?._id);

  useEffect(() => {
    /** Handles the click outside action. */
      function handleClickOutside(event: MouseEvent) {
      if (
        optionsRef.current && 
        !optionsRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.comment-options-dropdown')
      ) {
        setIsOptionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-2.5 group/comment">
      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden border border-slate-200">
        {commentUser?.photo && !commentUser.photo.includes('default') ? (
          <img src={commentUser.photo} alt={commentUser.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <User size={16} className="text-slate-400" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex-1 min-w-0">
              <div className="bg-[#f0f2f5] dark:bg-slate-800 rounded-2xl px-3 pt-2 pb-2.5 flex flex-col w-full relative">
                <textarea
                  ref={editInputRef}
                  value={editContent}
                  onChange={(e) => {
                    setEditContent(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmittingEdit}
                  className="w-full bg-transparent border-none text-[15px] text-[#050505] dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:ring-0 focus:outline-none min-h-[22px] overflow-hidden p-0 m-0 leading-tight"
                  rows={1}
                />
                {isSubmittingEdit && (
                  <div className="absolute right-2 top-2">
                    <Loader2 size={16} className="animate-spin text-slate-400" />
                  </div>
                )}
              </div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 ml-2">
                Press Esc to <span className="text-[#0866ff] hover:underline cursor-pointer" onClick={() => { setIsEditing(false); setEditContent(comment.content); }}>cancel</span> • Enter to save
              </div>
            </div>
          ) : (
            <div className="bg-[#f0f2f5] dark:bg-slate-800 px-3 pt-2 pb-2.5 rounded-2xl w-fit max-w-full">
              <span className="font-semibold text-[13px] hover:underline cursor-pointer text-[#050505] dark:text-white block truncate">{commentUser?.name || "Unknown"}</span>
              {comment.content && (
                <p className="text-[15px] text-[#050505] dark:text-gray-200 break-words whitespace-pre-line leading-tight">{comment.content}</p>
              )}
              {comment.image && (
                <div className="mt-2 rounded-xl overflow-hidden max-w-[250px]">
                  <img src={comment.image} alt="Comment attachment" className="w-full h-auto object-cover" />
                </div>
              )}
            </div>
          )}
          
          {!isEditing && isAuthor && (
            <div className={`relative ml-2 transition-opacity ${isOptionsOpen ? 'opacity-100' : 'opacity-0 group-hover/comment:opacity-100'}`} ref={optionsRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isOptionsOpen && optionsRef.current) {
                    const rect = optionsRef.current.getBoundingClientRect();
                    setDropdownPos({
                      top: rect.bottom + 4,
                      right: window.innerWidth - rect.right
                    });
                  }
                  setIsOptionsOpen(!isOptionsOpen);
                }}
                className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer ${isOptionsOpen ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 opacity-100' : ''}`}
              >
                <MoreHorizontal size={16} />
              </button>
              
              {isOptionsOpen && typeof document !== "undefined" && createPortal(
                <div 
                  className="fixed w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-[150] animate-fade-in comment-options-dropdown"
                  style={{ top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px` }}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOptionsOpen(false);
                      setIsEditing(true);
                      setEditContent(comment.content);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 size={14} className="text-slate-500 dark:text-slate-400" /> Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOptionsOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} className="text-red-500 dark:text-red-400" /> Delete
                  </button>
                </div>,
                document.body
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 items-center text-[12px] font-bold text-[#65676b] dark:text-gray-400 ml-3 mt-0.5">
          <span 
            className={`cursor-pointer hover:underline ${comment.isLiked ? 'text-[#0866ff] dark:text-blue-500' : ''}`}
            onClick={() => onLike()}
          >
            Like {comment.likesCount ? `(${comment.likesCount})` : ''}
          </span>
          <span className="cursor-pointer hover:underline">Reply</span>
          <span className="font-normal">{comment.createdAt ? formatTimeAgo(comment.createdAt) : 'Just now'}</span>
        </div>
      </div>
      
      {}
      {isDeleteModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-[400px] overflow-hidden animate-slide-up border border-transparent dark:border-slate-800">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Delete Comment?</h3>
              <button 
                onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Are you sure you want to delete this comment?
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 min-w-[100px] justify-center"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Deleting
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
