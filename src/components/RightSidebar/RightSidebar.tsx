import { Search, Users, UserPlus, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSuggestedFriends, followUser, unfollowUser } from "../../services/Profile.service";

/** Renders the right sidebar component. */
export default function RightSidebar() {
  const [suggestedFriends, setSuggestedFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const response = await getSuggestedFriends(token, 5);
        console.log("RightSidebar fetch response:", response);
        if (response.success && Array.isArray(response.data)) {
          // Add a local isFollowing state
          const friendsWithState = response.data.map(f => ({ ...f, isFollowingLocal: false }));
          console.log("Setting state with:", friendsWithState);
          setSuggestedFriends(friendsWithState);
        } else {
          console.error("RightSidebar: Failed to parse array or success is false", response);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    if (processingId) return;
    setProcessingId(userId);
    try {
      const token = localStorage.getItem("user_token");
      let success = false;
      
      // Note: we use follow/unfollow based on the current local state
      if (isFollowing) {
        const res = await unfollowUser(token, userId);
        success = res.success;
      } else {
        const res = await followUser(token, userId);
        success = res.success;
      }

      if (success) {
        setSuggestedFriends(prev => 
          prev.map(friend => 
            friend._id === userId 
              ? { ...friend, isFollowingLocal: !isFollowing }
              : friend
          )
        );
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600 dark:text-blue-500" strokeWidth={2} />
          <h2 className="font-bold text-slate-900 dark:text-white text-[16px]">Suggested Friends</h2>
        </div>
        <span className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-full">
          {suggestedFriends.length || 0}
        </span>
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400 dark:text-slate-500" strokeWidth={2} />
        </div>
        <input 
          type="text" 
          placeholder="Search friends..." 
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[14px] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : suggestedFriends.length > 0 ? (
          suggestedFriends.map((friend) => (
            <div key={friend._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm transition-all group">
              <Link to={`/user/${friend._id}`} className="flex items-center gap-3 overflow-hidden flex-1">
                <img 
                  src={friend.photo && !friend.photo.includes('default') ? friend.photo : `https://ui-avatars.com/api/?name=${friend.name}&background=random`} 
                  alt={friend.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                />
                <div className="flex flex-col overflow-hidden">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-[14px] leading-tight truncate">{friend.name || 'Unknown User'}</h4>
                  <span className="text-slate-500 dark:text-slate-400 text-[12px] truncate">@{friend.name ? friend.name.split(' ')[0].toLowerCase() : 'user'}</span>
                </div>
              </Link>
              
              <button 
                onClick={() => handleFollowToggle(friend._id, friend.isFollowingLocal)}
                disabled={processingId === friend._id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-[13px] transition-colors shrink-0 ml-2 ${
                  friend.isFollowingLocal 
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white'
                }`}
              >
                {processingId === friend._id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : friend.isFollowingLocal ? (
                  <>
                    <Check size={14} strokeWidth={2} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} strokeWidth={2} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-slate-500 py-4">No suggestions found</div>
        )}
      </div>

      <button 
        onClick={() => navigate('/friends')}
        className="w-full mt-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[14px] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700 cursor-pointer"
      >
        View all friends
      </button>
    </div>
  );
}
