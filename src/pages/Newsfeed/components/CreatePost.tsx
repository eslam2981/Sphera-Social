import { useState, useRef, useContext, useEffect } from "react";
import { Image as ImageIcon, Smile, User, X, Loader2, Video } from "lucide-react";
import { UserDataContext } from "../../../contexts/UserData";
import { createPost } from "../../../services/Profile.service";
import { ErrorMessage } from "../../../components/Alerts/ErrorMessage";
import type { CreatePostProps } from '../../../types';
import type { Theme } from 'emoji-picker-react';
import { lazy, Suspense } from 'react';
const EmojiPicker = lazy(() => import('emoji-picker-react'));
import { ThemeContext } from "../../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
export default function CreatePost({ onPostCreated }: CreatePostProps) {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const onEmojiClick = (emojiObject: any) => {
    setContent(prev => prev + emojiObject.emoji);
  };
    const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
    const { Data } = useContext(UserDataContext);
    const { isDarkMode } = useContext(ThemeContext);
  
  const userName = Data?.name || "Unknown User";
  const userPhoto = Data?.photo;
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
    const handleImageChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      setImage(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };
    const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
    const handleSubmit = async () => {
    if (!content.trim() && !image) {
      showError("Please write something or add a photo to post.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (content.trim()) formData.append("body", content.trim());
      if (image) formData.append("image", image);
      
      const response = await createPost(token, formData);
      if (response.success && response.data) {
        setContent("");
        removeImage();
        if (onPostCreated) {
          const newPost = response.data;
          if (!newPost.user || typeof newPost.user === 'string') {
            newPost.user = {
              _id: Data?._id,
              name: Data?.name,
              photo: Data?.photo,
              username: Data?.username || Data?.name?.toLowerCase().replace(/\s+/g, '')
            };
          }
          newPost.likesCount = newPost.likesCount || 0;
          newPost.commentsCount = newPost.commentsCount || 0;
          newPost.sharesCount = newPost.sharesCount || 0;
          
          onPostCreated(newPost);
        }
      } else {
        showError(response.message || "Failed to create post.");
      }
    } catch (error: any) {
      console.error("Error creating post:", error);
      showError(error.response?.data?.message || "An error occurred while creating the post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700/60 mb-4 px-4 pt-3 pb-2 relative">
      <div className="flex gap-2 items-start mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer hover:brightness-95 transition-all mt-1">
          {userPhoto && userPhoto !== "undefined" && !userPhoto.toLowerCase().includes('default') ? (
            <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <User size={20} className="text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
          )}
        </div>
        
        <div className="flex-1">
          <div className="bg-[#F0F2F5] dark:bg-slate-800 border border-transparent dark:border-slate-700/60 rounded-3xl flex flex-col focus-within:bg-[#E4E6E9] dark:focus-within:bg-slate-700/80 dark:focus-within:border-slate-600 transition-colors overflow-hidden px-4 py-2">
            <textarea
              placeholder={`What's on your mind, ${userName.split(' ')[0]}?`}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              className="w-full bg-transparent border-none text-[17px] text-[#050505] dark:text-gray-200 placeholder-[#65676b] dark:placeholder-gray-400 resize-none focus:ring-0 focus:outline-none min-h-[40px] leading-relaxed py-1 transition-[height] duration-200 ease-in-out overflow-hidden"
              rows={1}
            />
            
            {imagePreview && (
              <div className="relative mt-2 mb-2 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 animate-fade-in-up">
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 rounded-full flex items-center justify-center shadow-sm z-10 transition-colors cursor-pointer"
                >
                  <X size={16} className="text-gray-700 dark:text-gray-300" />
                </button>
                <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-cover" />
              </div>
            )}
            
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden flex justify-end ${
                (content.trim() || imagePreview) 
                  ? 'max-h-20 opacity-100 pt-2 pb-1 border-t border-gray-200/50 dark:border-slate-700 mt-2' 
                  : 'max-h-0 opacity-0 pt-0 pb-0 border-t-0 border-transparent mt-0'
              }`}
            >
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-4 py-1.5 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-[15px]"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Posting...</>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ced0d4] dark:border-slate-700/60 pt-2 px-2 pb-1 flex items-center justify-between">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#f2f2f2] dark:hover:bg-slate-800 transition-colors cursor-pointer text-[#65676b] dark:text-gray-300 font-semibold text-[15px]">
          <Video size={24} className="text-[#f3425f]" strokeWidth={1.5} />
          <span className="hidden sm:inline">Live video</span>
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#f2f2f2] dark:hover:bg-slate-800 transition-colors cursor-pointer text-[#65676b] dark:text-gray-300 font-semibold text-[15px]"
        >
          <ImageIcon size={24} className="text-[#45bd62]" strokeWidth={1.5} />
          <span className="hidden sm:inline">Photo/video</span>
        </button>

           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-[#f2f2f2] dark:hover:bg-slate-800 transition-colors cursor-pointer text-[#65676b] dark:text-gray-300 font-semibold text-[15px]"
        >
          <Smile size={24} className="text-[#f7b928]" strokeWidth={1.5} />
          <span className="hidden sm:inline">Feeling/activity</span>
        </button>
      </div>

      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 mt-2 right-4 shadow-xl custom-emoji-picker origin-top-right"
          >
            <style>{`
              .custom-emoji-picker aside.EmojiPickerReact {
                border-color: ${isDarkMode ? '#334155' : '#e2e8f0'};
                background-color: ${isDarkMode ? '#0f172a' : '#ffffff'};
              }
              .custom-emoji-picker .epr-body::-webkit-scrollbar {
                display: none;
              }
              .custom-emoji-picker .epr-body {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .custom-emoji-picker .epr-search {
                background-color: ${isDarkMode ? '#1e293b' : '#f1f5f9'} !important;
                border-color: transparent !important;
              }
              .custom-emoji-picker .epr-search:focus {
                border-color: #3b82f6 !important;
              }
            `}</style>
            <Suspense fallback={<div className="flex justify-center p-4"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}><EmojiPicker 
              onEmojiClick={onEmojiClick}
              theme={isDarkMode ? 'dark' as Theme : 'light' as Theme}
              lazyLoadEmojis={true}
              previewConfig={{ showPreview: false }}
            />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorMessage message={errorMsg} />
    </div>
  );
}
