import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserDataContext } from "../../contexts/UserData";
import { Calendar, Mail, Loader2, User, Users, Cake, ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { getUserProfileById, getUserPosts, followUser, unfollowUser } from "../../services/Profile.service";
import PostCard from "../Newsfeed/components/PostCard";
import type { Post } from "../../types";
import { formatTimeAgo } from "../../utils/dateUtils";
import { SuccessMessage } from "../../components/Alerts/SuccessMessage";
import { ErrorMessage } from "../../components/Alerts/ErrorMessage";
import ProfileSkeleton from "../Profile/components/ProfileSkeleton";
import PostCardSkeleton from "../Newsfeed/components/PostCardSkeleton";
export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
    const { Data } = useContext(UserDataContext);
    const [profileUser, setProfileUser] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const { name, email, username, cover, createdAt, followersCount, followingCount, gender, dateOfBirth, photo } = profileUser || {};
    // Format date to a readable string
    const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
      // Fetch the viewed user profile data
      const fetchProfileData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const token = localStorage.getItem("user_token");
        if (token) {
          const res = await getUserProfileById(token, id);
          if (res.success && res.data) {
            setProfileUser(res.data);
            
            
            const userData = Data as any;
            const currentUserId = userData?._id || userData?.id;
            let isFollowingUser = false;
            
            if (res.data.isFollowed !== undefined) {
              isFollowingUser = res.data.isFollowed;
            } else if (res.data.isFollowing !== undefined) {
              isFollowingUser = res.data.isFollowing;
            } else if (currentUserId && res.data.followers && Array.isArray(res.data.followers)) {
              isFollowingUser = res.data.followers.some((f: any) => (f._id || f.id || f) === currentUserId);
            } else if (userData && userData.following && Array.isArray(userData.following)) {
              isFollowingUser = userData.following.some((f: any) => (f._id || f.id || f) === id);
            }
            
            setIsFollowing(isFollowingUser);
          }
          
          const postsRes = await getUserPosts(token, id);
          if (postsRes.success) {
            setUserPosts(postsRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id]);

  
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    // Toggle follow or unfollow user
    const handleFollowToggle = async () => {
    if (!id || isFollowLoading) return;
    const token = localStorage.getItem("user_token");
    if (!token) return;

    try {
      setIsFollowLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      if (isFollowing) {
        // Unfollows the user and decrements the followers count
        const res = await unfollowUser(token, id);
        if (res.success) {
          setIsFollowing(false);
          setProfileUser((prev: any) => prev ? { ...prev, followersCount: Math.max(0, (prev.followersCount || 0) - 1) } : prev);
          setSuccessMsg(`Unfollowed ${name || "user"} successfully.`);
          setTimeout(() => setSuccessMsg(""), 3000);
        } else {
          setErrorMsg("Failed to unfollow user");
          setTimeout(() => setErrorMsg(""), 3000);
        }
      } else {
        // Follows the user and increments the followers count
        const res = await followUser(token, id);
        if (res.success) {
          setIsFollowing(true);
          setProfileUser((prev: any) => prev ? { ...prev, followersCount: (prev.followersCount || 0) + 1 } : prev);
          setSuccessMsg(`Started following ${name || "user"}.`);
          setTimeout(() => setSuccessMsg(""), 3000);
        } else {
          setErrorMsg("Failed to follow user");
          setTimeout(() => setErrorMsg(""), 3000);
        }
      }
    } catch (err: any) {
      console.error("Follow error", err);
      setErrorMsg(err?.response?.data?.message || err?.message || "An error occurred");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto animate-fade-in-up">
      <SuccessMessage message={successMsg} />
      <ErrorMessage message={errorMsg} />
      
      {isLoading && !profileUser ? (
        <div className="mb-4">
          <ProfileSkeleton />
          <div className="px-4 sm:px-8 mt-6 space-y-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      ) : (
        <>
      {}
      <div className="py-3 px-2 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer font-medium px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {}
      <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-none sm:rounded-b-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm">
        {cover && cover !== 'undefined' && !cover.includes('default') ? (
          <img src={cover} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
      </div>

      {}
      <div className="px-4 sm:px-8 relative">
        <div className="flex flex-row items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
            <div className="w-full h-full rounded-full border-4 border-[#F0F2F5] dark:border-slate-900 shadow-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
              {photo && !imgError && photo !== "undefined" && !photo.includes('default') ? (
                <img src={photo} alt={name} onError={() => setImgError(true)} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-slate-400 dark:text-slate-500 transition-opacity duration-300" strokeWidth={1.5} />
              )}
            </div>
          </div>
          
          <div className="flex gap-3 mb-2 sm:mb-4">
            <button 
              className={`cursor-pointer px-6 py-2.5 font-medium rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2 ${
                isFollowing 
                  ? "bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } ${isFollowLoading ? "opacity-75 cursor-not-allowed" : ""}`}
              onClick={handleFollowToggle}
              disabled={isFollowLoading}
            >
              {isFollowLoading ? <Loader2 size={18} className="animate-spin" /> : isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
              <span className="hidden sm:inline">{isFollowing ? "Unfollow" : "Follow"}</span>
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
            <div className="flex gap-1.5 items-baseline group">
              <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:underline">{followingCount || 0}</span>
              <span className="text-slate-500 dark:text-gray-400 font-medium group-hover:text-slate-700 dark:group-hover:text-gray-300">Following</span>
            </div>
            <div className="flex gap-1.5 items-baseline group">
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
                className={`cursor-pointer pb-4 text-sm font-bold transition-colors relative whitespace-nowrap ${idx === 0 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-gray-400"}`}
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
          <div className="space-y-6">
            <PostCardSkeleton />
            <PostCardSkeleton />
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
              <User size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No posts yet</h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm">When {name} shares photos, thoughts, or links, they will appear here.</p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  )
}
