import React, { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Image as ImageIcon } from "lucide-react";
import { getPostComments, createPostComment, deletePostComment, updatePostComment, deletePost, likePostComment, likePost, sharePost, updatePost } from "../../../services/Profile.service";
import CommentsSection from "./CommentsSection";
import type { Comment } from "../../../types";
import { Loader2 } from "lucide-react";
import { UserDataContext } from "../../../contexts/UserData";
import PostCardHeader from "./PostCardHeader";
import PostCardContent from "./PostCardContent";
import PostCardStats from "./PostCardStats";
import PostCardActions from "./PostCardActions";
import { ErrorMessage } from "../../../components/Alerts/ErrorMessage";
import type { PostCardProps } from '../../../types';

/** Renders the post card component. */
function PostCard({ postId, authorId, authorName, authorPhoto, timeAgo, content, imageUrl, likes, likesArray, comments, topComment, shares, onPostDeleted, onPostShared, isShare, reposterId, reposterName, reposterPhoto, reposterTimeAgo, reposterContent, priority }: PostCardProps) {
  /** Renders the {  data } component. */
    const { Data } = useContext(UserDataContext);
    const [liked, setLiked] = useState(() => {
    if (Data && Data._id && likesArray) {
      return likesArray.includes(Data._id);
    }
    return false;
  });
    const [localLikesCount, setLocalLikesCount] = useState(likes);
    const [localCommentsCount, setLocalCommentsCount] = useState(comments);
    const [localSharesCount, setLocalSharesCount] = useState(shares);

  useEffect(() => {
    if (Data && Data._id && likesArray) {
      setLiked(likesArray.includes(Data._id));
    }
  }, [Data, likesArray]);
  
  useEffect(() => {
    setLocalSharesCount(shares);
  }, [shares]);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [commentsList, setCommentsList] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Delete Post state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Edit Post state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editContent, setEditContent] = useState(content);
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(imageUrl || null);
    const [isUpdatingPost, setIsUpdatingPost] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);
    const [localContent, setLocalContent] = useState(content);

  // Share state
    const [isSharing, setIsSharing] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareText, setShareText] = useState("");
  
  // Custom Error state
    const [errorMsg, setErrorMsg] = useState("");
  /** Manages show error logic. */
    const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  /** Handles the like click action. */
    const handleLikeClick = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) {
      setLocalLikesCount(prev => prev + 1);
    } else {
      setLocalLikesCount(prev => prev - 1);
    }
    
    try {
      const token = localStorage.getItem("user_token");
      await likePost(token, postId);
    } catch (error) {
      console.error("Error toggling like", error);
      setLiked(!newLiked);
      if (!newLiked) {
        setLocalLikesCount(prev => prev + 1);
      } else {
        setLocalLikesCount(prev => prev - 1);
      }
    }
  };

  /** Handles the share click action. */
    const handleShareClick = () => {
    setIsShareModalOpen(true);
    setShareText("");
  };

  /** Handles the share confirm action. */
    const handleShareConfirm = async () => {
    if (isSharing) return;
    
    if (!shareText.trim()) {
      showError("Please write something to share this post.");
      return;
    }
    
    setIsSharing(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await sharePost(token, postId, shareText);
      if (response.success) {
        setLocalSharesCount(prev => prev + 1);
        setIsShareModalOpen(false);
        setShareText("");
        
        if (onPostShared && response.data) {
          const newPost = response.data;
          // Ensure user info is fully populated
          if (!newPost.user || typeof newPost.user === 'string') {
            newPost.user = {
              _id: Data?._id,
              name: Data?.name,
              photo: Data?.photo,
              username: Data?.username || Data?.name?.toLowerCase().replace(/\s+/g, '')
            };
          }
          // Set default counts
          newPost.likesCount = newPost.likesCount || 0;
          newPost.commentsCount = newPost.commentsCount || 0;
          newPost.sharesCount = newPost.sharesCount || 0;
          newPost.isShare = true; // explicitly mark as share if needed
          
          onPostShared(newPost);
        }
      }
    } catch (error: any) {
      console.error("Error sharing post", error);
      showError(error.response?.data?.message || "Failed to share post.");
    } finally {
      setIsSharing(false);
    }
  };

  /** Handles the edit post open action. */
    const handleEditPostOpen = () => {
    setEditContent(localContent);
    setEditImagePreview(imageUrl || null);
    setEditImage(null);
    setIsEditModalOpen(true);
  };

  /** Handles the edit post confirm action. */
    const handleEditPostConfirm = async () => {
    if (isUpdatingPost) return;
    setIsUpdatingPost(true);
    try {
      const token = localStorage.getItem("user_token");
      const formData = new FormData();
      formData.append("body", editContent);
      if (editImage) {
        formData.append("image", editImage);
      }
      const response = await updatePost(token, postId, formData);
      if (response.success) {
        setLocalContent(editContent);
        setIsEditModalOpen(false);
        showError("");
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to update post.");
    } finally {
      setIsUpdatingPost(false);
    }
  };

  /** Handles the delete post confirm action. */
    const handleDeletePostConfirm = async () => {
    setIsDeletingPost(true);
    try {
      const token = localStorage.getItem("user_token");
      const response = await deletePost(token, postId);
      if (response.success && onPostDeleted) {
        onPostDeleted();
        
      }
    } catch (error: any) {
      console.error("Error deleting post", error);
      showError(error.response?.data?.message || "Failed to delete post.");
    } finally {
      setIsDeletingPost(false);
      setIsDeleteModalOpen(false);
    }
  };

  /** Handles the toggle comments action. */
    const handleToggleComments = async () => {
    setIsCommentsOpen(!isCommentsOpen);
    
    if (!isCommentsOpen) {
      if (commentsList.length === 0) {
        setIsLoadingComments(true);
      }
      try {
        const token = localStorage.getItem("user_token");
        const response = await getPostComments(token, postId, 10, 1);
        if (response.success) {
          setCommentsList(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching comments", error);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  /** Handles the add comment action. */
    const handleAddComment = async () => {
    if ((!newCommentText.trim() && !commentImage) || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      const token = localStorage.getItem("user_token");
      let dataToSend: string | FormData = newCommentText;
      
      if (commentImage) {
        const formData = new FormData();
        formData.append("content", newCommentText);
        formData.append("image", commentImage);
        dataToSend = formData;
      }

      const response = await createPostComment(token, postId, dataToSend);
      if (response.success) {
        setNewCommentText("");
        setCommentImage(null);
        
        // Refetch comments
        setIsLoadingComments(true);
        const commentsResponse = await getPostComments(token, postId, 10, 1);
        if (commentsResponse.success) {
          setCommentsList(commentsResponse.data || []);
          if (commentsResponse.total) {
            setLocalCommentsCount(commentsResponse.total);
          } else {
            // Fallback if total isn't returned
            setLocalCommentsCount((prev) => prev + 1);
          }
        }
        setIsLoadingComments(false);
      }
    } catch (error) {
      console.error("Error creating comment", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  /** Handles the delete comment action. */
    const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await deletePostComment(token, postId, commentId);
      if (response.success) {
        setCommentsList((prev) => prev.filter((c) => c._id !== commentId));
        setLocalCommentsCount((prev) => Math.max(0, prev - 1));
      } else {
        showError(response.message || "Failed to delete comment");
      }
    } catch (error: any) {
      console.error("Error deleting comment", error);
      showError(error.response?.data?.message || error.response?.data?.error || "An error occurred while deleting the comment");
    }
  };

  /** Handles the edit comment action. */
    const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await updatePostComment(token, postId, commentId, newContent);
      if (response.success) {
        setCommentsList((prev) => prev.map((c) => c._id === commentId ? { ...c, content: newContent } : c));
      } else {
        showError(response.message || "Failed to edit comment");
      }
    } catch (error: any) {
      console.error("Error editing comment", error);
      showError(error.response?.data?.message || error.response?.data?.error || "An error occurred while editing the comment");
    }
  };

  /** Handles the like comment action. */
    const handleLikeComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await likePostComment(token, postId, commentId);
      if (response.success) {
        setCommentsList(prev => prev.map(c => {
          if (c._id === commentId) {
            const isLiked = !c.isLiked;
            return {
              ...c,
              isLiked,
              likesCount: Math.max(0, (c.likesCount || 0) + (isLiked ? 1 : -1))
            };
          }
          return c;
        }));
      }
    } catch (error) {
      console.error("Error liking comment", error);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700/60 mb-4">
        
        {}
        {isShare && reposterId && (
          <PostCardHeader 
            postId={postId}
            authorId={reposterId}
            authorName={reposterName || ''}
            authorPhoto={reposterPhoto}
            timeAgo={reposterTimeAgo || ''}
            content=""
            currentUserId={Data?._id || ''}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
            isRepostHeader={true}
          />
        )}

        {/* Reposter's Content  */}
        {isShare && reposterContent && reposterContent.trim() !== "" && (
          <div className="px-4 pt-3 pb-1">
            <p className="text-[#050505] dark:text-gray-200 text-[15px] sm:text-[16px] leading-relaxed break-words whitespace-pre-wrap">
              {reposterContent}
            </p>
          </div>
        )}

        {}
        <div className={isShare ? "mx-3 mb-3 mt-2 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900" : ""}>
          {/* Header */}
          <PostCardHeader 
            postId={postId}
            authorId={authorId}
            authorName={authorName}
            authorPhoto={authorPhoto}
            timeAgo={timeAgo}
            content={content}
            currentUserId={Data?._id || ''}
            onDeleteClick={!isShare ? () => setIsDeleteModalOpen(true) : () => {}}
            onEditClick={!isShare ? handleEditPostOpen : undefined}
            hideOptions={isShare}
          />

          {/* Content */}
          <PostCardContent 
            content={localContent}
            imageUrl={editImage && editImagePreview ? editImagePreview : imageUrl}
            priority={priority}
          />
        </div>

        {/* Stats Row */}
        <PostCardStats 
          likesCount={localLikesCount}
          commentsCount={localCommentsCount}
          sharesCount={localSharesCount}
        />

        {/* Actions */}
        <PostCardActions 
          liked={liked}
          onLike={handleLikeClick}
          onCommentToggle={handleToggleComments}
          onShare={handleShareClick}
        />

      {/* Comments Section */}
      <CommentsSection 
        isCommentsOpen={isCommentsOpen}
        isLoadingComments={isLoadingComments}
        commentsList={commentsList}
        topComment={topComment}
          onCommentToggle={handleToggleComments}
          commentsCount={comments}
        currentUserId={Data?._id || ''}
        newCommentText={newCommentText}
        setNewCommentText={setNewCommentText}
        commentImage={commentImage}
        setCommentImage={setCommentImage}
        handleAddComment={handleAddComment}
        isSubmittingComment={isSubmittingComment}
        handleDeleteComment={handleDeleteComment}
        handleEditComment={handleEditComment}
        handleLikeComment={handleLikeComment}
      />
      </div>

      {/* Edit Post Modal */}
      {isEditModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden animate-slide-up border border-transparent dark:border-slate-700/60 flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Edit Post</h3>
              <button 
                onClick={() => !isUpdatingPost && setIsEditModalOpen(false)}
                disabled={isUpdatingPost}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg text-[16px] text-slate-900 dark:text-gray-200 placeholder-slate-400 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[120px] p-3"
              />

              {editImagePreview && (
                <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => { setEditImagePreview(null); setEditImage(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 rounded-full flex items-center justify-center shadow-sm z-10 transition-colors cursor-pointer"
                  >
                    <X size={16} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <img src={editImagePreview} alt="Preview" className="w-full max-h-[250px] object-cover" />
                </div>
              )}

              <button
                onClick={() => editFileInputRef.current?.click()}
                className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium cursor-pointer"
              >
                <ImageIcon size={16} /> Change Photo
              </button>
              <input
                type="file"
                ref={editFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setEditImage(file);
                    setEditImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-800/30 flex justify-end">
              <button
                onClick={handleEditPostConfirm}
                disabled={isUpdatingPost || !editContent.trim()}
                className="px-8 py-2.5 rounded-lg font-semibold bg-[#1877f2] text-white hover:bg-[#166fe5] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] justify-center text-[15px]"
              >
                {isUpdatingPost ? (
                  <><Loader2 size={18} className="animate-spin" /> Saving...</>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {}
      {isDeleteModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-[400px] overflow-hidden animate-slide-up border border-transparent dark:border-slate-700/60">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Delete Post?</h3>
              <button 
                onClick={() => !isDeletingPost && setIsDeleteModalOpen(false)}
                disabled={isDeletingPost}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Are you sure you want to delete this post? This action cannot be undone and will remove all comments and likes.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeletingPost}
                  className="px-4 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeletePostConfirm}
                  disabled={isDeletingPost}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 min-w-[100px] justify-center"
                >
                  {isDeletingPost ? (
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

      {}
      {isShareModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden animate-slide-up border border-transparent dark:border-slate-700/60 flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Share Post</h3>
              <button 
                onClick={() => !isSharing && setIsShareModalOpen(false)}
                disabled={isSharing}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                {Data?.photo && Data.photo !== "undefined" && !Data.photo.includes('default') ? (
                  <img src={Data.photo} alt="Your profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-slate-900 dark:text-gray-200 block mb-1 text-[15px]">{Data?.name || "You"}</span>
                <textarea 
                  value={shareText}
                  onChange={(e) => setShareText(e.target.value)}
                  placeholder="Say something about this..."
                  className="w-full bg-transparent border-none text-[20px] sm:text-[24px] text-slate-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:ring-0 focus:outline-none min-h-[100px] py-1"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-800/30 flex justify-end">
              <button 
                onClick={handleShareConfirm}
                disabled={isSharing}
                className="px-8 py-2.5 rounded-lg font-semibold bg-[#1877f2] text-white hover:bg-[#166fe5] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] justify-center text-[15px]"
              >
                {isSharing ? (
                  <><Loader2 size={18} className="animate-spin" /> Sharing...</>
                ) : (
                  "Share Now"
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      <ErrorMessage message={errorMsg} />
    </>
  );
}

export default React.memo(PostCard, (prevProps, nextProps) => {
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.likes === nextProps.likes &&
    prevProps.comments === nextProps.comments &&
    prevProps.shares === nextProps.shares &&
    prevProps.content === nextProps.content &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.isShare === nextProps.isShare &&
    prevProps.topComment?._id === nextProps.topComment?._id
  );
});
