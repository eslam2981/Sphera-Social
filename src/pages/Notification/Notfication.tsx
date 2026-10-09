import { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2, MoreHorizontal, Check, Bell, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications } from "../../services/Profile.service";
import { formatTimeAgo } from "../../utils/dateUtils";
export default function Notfication() {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const token = localStorage.getItem("user_token");
  const queryClient = useQueryClient();

  
  useEffect(() => {
      const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
    const { data = {}, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(token, false, 1, 50),
    refetchInterval: 15000,
  });

  
  const notificationsArray = Array.isArray((data as any)?.data) ? (data as any).data : (data as any)?.data?.notifications || [];

  
  const displayNotifications = notificationsArray.filter((n: any) => 
    activeTab === "all" || (n.isRead !== true && n.unread !== false)
  );
    const markAllAsRead = () => {
    
    queryClient.setQueryData(['notifications'], (oldData: any[]) => {
      if (!oldData) return [];
      return oldData.map(n => ({ ...n, isRead: true, unread: false }));
    });
  };
    const markAsRead = (id: string) => {
    
    queryClient.setQueryData(['notifications'], (oldData: any[]) => {
      if (!oldData) return [];
      return oldData.map(n => 
        (n._id || n.id) === id ? { ...n, isRead: true, unread: false } : n
      );
    });
  };
    const sliceName = (username: string | undefined) => {
    if (!username) return "U";
    const parts = username.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };
    const getIcon = (type: string) => {
    if (type?.includes("like")) return <Heart size={14} className="text-white fill-current" />;
    if (type?.includes("comment")) return <MessageCircle size={14} className="text-white fill-current" />;
    if (type?.includes("share")) return <Repeat2 size={14} className="text-white" strokeWidth={3} />;
    if (type?.includes("follow")) return <UserPlus size={14} className="text-white" />;
    return <Bell size={14} className="text-white" />;
  };
    const getIconBg = (type: string) => {
    if (type?.includes("like")) return "bg-red-500";
    if (type?.includes("comment")) return "bg-emerald-500";
    if (type?.includes("share")) return "bg-indigo-500";
    if (type?.includes("follow")) return "bg-blue-500";
    return "bg-slate-500";
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-7xl pt-6 pb-20">
      {}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Notifications
        </h1>
        <button 
          onClick={markAllAsRead}
          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Check size={16} />
          <span className="hidden sm:inline">Mark all as read</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {}
        <div className="flex px-4 border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-4 py-4 font-semibold text-[15px] border-b-2 transition-colors cursor-pointer ${activeTab === "all" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-4 font-semibold text-[15px] border-b-2 transition-colors cursor-pointer ${activeTab === "unread" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
          >
            Unread
          </button>
        </div>

        {}
        <div className="flex flex-col gap-3 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/50 min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col w-full gap-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 animate-pulse bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center px-4"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <Bell size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Failed to load</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[15px]">
                We couldn't load your notifications right now.
              </p>
            </motion.div>
          ) : displayNotifications.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {displayNotifications.map((notif: any, index: number) => {
                const isUnread = notif.isRead !== true && notif.unread !== false;
                
                
                const actionUser = typeof notif.user === 'object' ? notif.user : 
                                   typeof notif.sender === 'object' ? notif.sender : 
                                   typeof notif.actor === 'object' ? notif.actor :
                                   typeof notif.from === 'object' ? notif.from : {};
                                   
                const userPhoto = actionUser?.photo || notif.photo;
                const userName = actionUser?.name || notif.name || "Unknown User";
                
                const rawType = (notif.type || notif.action || "like").toLowerCase();
                
                let actionText = notif.content || notif.message || "";
                if (!actionText) {
                  if (rawType.includes("share")) actionText = "shared your post.";
                  else if (rawType.includes("like")) actionText = "liked your post.";
                  else if (rawType.includes("comment")) actionText = "commented on your post.";
                  else if (rawType.includes("follow")) actionText = "started following you.";
                  else actionText = "interacted with your post.";
                }
                
                const timeStr = notif.createdAt ? formatTimeAgo(notif.createdAt) : "Just now";
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    key={notif._id || notif.id} 
                    className={`flex gap-4 p-4 transition-all rounded-xl border cursor-pointer ${
                      isUnread 
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/40' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-sm'
                    }`}
                  >
                    {}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-lg shrink-0">
                        {userPhoto && userPhoto !== "undefined" && !userPhoto.toLowerCase().includes('default') ? (
                          <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{sliceName(userName)}</span>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 ${getIconBg(rawType)} shadow-sm`}>
                        {getIcon(rawType)}
                      </div>
                    </div>

                    {}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[15px] text-slate-800 dark:text-slate-200 leading-snug pr-4">
                        <span className="font-bold text-slate-900 dark:text-white mr-1">{userName}</span>
                        {actionText}
                      </p>
                      <span className={`text-[13px] mt-1 ${isUnread ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {timeStr}
                      </span>
                    </div>

                    {}
                    <div className="flex flex-col items-end justify-between shrink-0 pl-2 relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === (notif._id || notif.id) ? null : (notif._id || notif.id));
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {openDropdownId === (notif._id || notif.id) && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-10 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-20 overflow-hidden"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif._id || notif.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-left text-[14px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 cursor-pointer"
                          >
                            <Check size={16} />
                            Mark as read
                          </button>
                        </motion.div>
                      )}

                      {isUnread && (
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 mb-2 mr-2"></div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center px-4"
            >
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Bell size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No notifications yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[15px]">
                When you get notifications, they'll show up here.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
