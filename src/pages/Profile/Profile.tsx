import { useState, useRef, useContext, useEffect } from "react";
import { UserDataContext } from "../../contexts/UserData";
import { Camera, Calendar, Edit3, Mail, Loader2, User, Users, Cake } from "lucide-react";
import { uploadProfilePhoto, getUserProfile, getUserPosts } from "../../services/Profile.service";
import PostCard from "../Newsfeed/components/PostCard";
import type { Post } from "../../types";
import { formatTimeAgo } from "../../utils/dateUtils";

/** Renders the profile component. */
export default function Profile() {
  /** Renders the {  data, save user data } component. */
    const { Data, saveUserData } = useContext(UserDataContext);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
  /** Renders the { name, email, username, cover, created at, followers count, following count, gender, date of birth } component. */
    const { name, email, username, cover, createdAt, followersCount, followingCount, gender, dateOfBirth } = Data || {};
  
  /** Manages format date logic. */
    const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
    const [isUploading, setIsUploading] = useState(false);
    const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    /** Fetches profile data data. */
      const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("user_token");
        if (token) {
          const res = await getUserProfile(token);
          if (res.success && res.data) {
            saveUserData({ ...Data, ...res.data });
          }
          
          
          if (Data?._id) {
            const postsRes = await getUserPosts(token, Data._id);
            if (postsRes.success) {
              setUserPosts(postsRes.data);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (Data?._id) {
      fetchProfileData();
    }
  }, [Data?._id]);

  /** Handles the image change action. */
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const previewUrl = URL.createObjectURL(file);
      setImgError(false); 
      if (Data) saveUserData({ ...Data, photo: previewUrl });

      const token = localStorage.getItem("user_token");
      const formData = new FormData();
      formData.append("photo", file); 

      const response = await uploadProfilePhoto(token, formData);
      if (response.success && response.data) {
        
        if (Data) {
          saveUserData({ ...Data, photo: response.data.photo || previewUrl });
        }
      } else {
         console.error("Failed to upload photo:", response.message);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full mx-auto animate-fade-in-up">
      {}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {}
      <div 
        className="relative w-full h-48 md:h-64 lg:h-80 rounded-b-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 group cursor-pointer shadow-sm"
      >
        {cover && cover !== 'undefined' && !cover.includes('default') ? (
          <img src={cover} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Camera size={48} className="text-white" />
        </div>
      </div>

      {}
      <div className="px-4 sm:px-8 relative">
        <div className="flex flex-row items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
          <div 
            className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 group cursor-pointer"
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className="w-full h-full rounded-full border-4 border-[#F0F2F5] dark:border-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
              {Data?.photo && !imgError && Data.photo !== "undefined" && !Data.photo.includes('default') ? (
                <img src={Data.photo} alt={name} onError={() => setImgError(true)} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-slate-400 dark:text-slate-500 group-hover:opacity-30 transition-opacity duration-300" strokeWidth={1.5} />
              )}
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isUploading ? (
                  <Loader2 size={32} className="text-white animate-spin" />
                ) : (
                  <Camera size={32} className="text-white" />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-2 sm:mb-4">
            <button className="cursor-pointer px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <Edit3 size={18} />
              <span className="hidden sm:inline">Edit Profile</span>
            </button>
          </div>
        </div>

        {}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{name || "Unknown User"}</h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium text-lg">@{username || "username"}</p>
          
          {email && (
            <p className="mt-4 text-slate-600 dark:text-gray-300 max-w-2xl leading-relaxed flex items-center gap-2">
              <Mail size={18} className="text-slate-400 dark:text-gray-500" />
              {email}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mt-4 text-slate-500 dark:text-gray-400 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-slate-400 dark:text-gray-500" />
              <span>Joined {createdAt ? formatDate(createdAt) : "recently"}</span>
            </div>
            {dateOfBirth && (
              <div className="flex items-center gap-1.5">
                <Cake size={16} className="text-slate-400 dark:text-gray-500" />
                <span>Born {formatDate(dateOfBirth)}</span>
              </div>
            )}
            {gender && (
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-slate-400 dark:text-gray-500" />
                <span className="capitalize">{gender}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-6 mt-6">
            <div className="flex gap-1.5 items-baseline cursor-pointer group">
              <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:underline">{followingCount || 0}</span>
              <span className="text-slate-500 dark:text-gray-400 font-medium group-hover:text-slate-700 dark:group-hover:text-gray-300">Following</span>
            </div>
            <div className="flex gap-1.5 items-baseline cursor-pointer group">
              <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:underline">{followersCount || 0}</span>
              <span className="text-slate-500 dark:text-gray-400 font-medium group-hover:text-slate-700 dark:group-hover:text-gray-300">Followers</span>
            </div>
          </div>
        </div>

        {}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {["Posts", "Replies", "Media", "Likes"].map((tab, idx) => (
              <button 
                key={tab}
                className={`cursor-pointer pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${idx === 0 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"}`}
              >
                {tab}
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map(post => (
              <PostCard 
                key={post._id}
                postId={post._id}
                authorId={post.isShare && post.sharedPost ? post.sharedPost.user._id : post.user._id}
                authorName={post.isShare && post.sharedPost ? post.sharedPost.user.name : post.user.name} 
                authorPhoto={post.isShare && post.sharedPost ? post.sharedPost.user.photo : post.user.photo}
                timeAgo={formatTimeAgo(post.isShare && post.sharedPost ? post.sharedPost.createdAt : post.createdAt)} 
                content={post.isShare && post.sharedPost ? post.sharedPost.body || "" : post.body || ""} 
                imageUrl={post.isShare && post.sharedPost ? post.sharedPost.image : post.image} 
                likes={post.likesCount} 
                likesArray={post.likes}
                comments={post.commentsCount || 0}
                      topComment={post.topComment}
                shares={post.sharesCount}
                onPostDeleted={() => setUserPosts(prev => prev.filter(p => p._id !== post._id))}
                onPostShared={() => {}}
                isShare={post.isShare}
                reposterId={post.isShare ? post.user._id : undefined}
                reposterName={post.isShare ? post.user.name : undefined}
                reposterPhoto={post.isShare ? post.user.photo : undefined}
                reposterTimeAgo={post.isShare ? formatTimeAgo(post.createdAt) : undefined}
                reposterContent={post.isShare ? post.body : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 text-indigo-500 dark:text-indigo-400">
              <Camera size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No posts yet</h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm">When you share photos, thoughts, or links, they will appear here.</p>
          </div>
        )}
      </div>

    </div>
  )
}
