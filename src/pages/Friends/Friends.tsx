import { useState, useEffect } from "react";
import { Users, Search, UserPlus, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getSuggestedFriends, followUser, unfollowUser } from "../../services/Profile.service";

export default function Friends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("user_token");
        // For the friends page we might want more suggestions
        const response = await getSuggestedFriends(token, 50);
        if (response.success && Array.isArray(response.data)) {
          const friendsWithState = response.data.map(f => ({ ...f, isFollowingLocal: false }));
          setFriends(friendsWithState);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    if (processingId) return;
    setProcessingId(userId);
    try {
      const token = localStorage.getItem("user_token");
      let success = false;
      
      if (isFollowing) {
        const res = await unfollowUser(token, userId);
        success = res.success;
      } else {
        const res = await followUser(token, userId);
        success = res.success;
      }

      if (success) {
        setFriends(prev => 
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

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500">
              <Users size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">People You May Know</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Find friends and build your network</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search people..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 flex flex-col items-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mb-3" />
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
              <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/user/${friend._id}`}>
                <img 
                  src={friend.photo && !friend.photo.includes('default') ? friend.photo : `https://ui-avatars.com/api/?name=${friend.name}&background=random`} 
                  alt={friend.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm mb-3" 
                />
              </Link>
              <Link to={`/user/${friend._id}`} className="hover:underline">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate w-full">{friend.name || 'Unknown'}</h3>
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">@{friend.name ? friend.name.split(' ')[0].toLowerCase() : 'user'}</p>
              
              <button 
                onClick={() => handleFollowToggle(friend._id, friend.isFollowingLocal)}
                disabled={processingId === friend._id}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  friend.isFollowingLocal 
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20'
                }`}
              >
                {processingId === friend._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : friend.isFollowingLocal ? (
                  <>
                    <Check size={16} strokeWidth={2} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} strokeWidth={2} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-500">
            <Users size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-lg font-medium">No people found</p>
            {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
          </div>
        )}
      </div>
    </div>
  );
}
