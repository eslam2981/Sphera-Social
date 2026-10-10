import { AlertCircle, RefreshCw, LogIn, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard"; 
import PostCardSkeleton from "./components/PostCardSkeleton";
import { getPosts, getUserPosts, getSinglePost } from "../../services/Profile.service";
import { formatTimeAgo } from "../../utils/dateUtils";
import type { Post } from "../../types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useContext } from "react";
import { UserDataContext } from "../../contexts/UserData";
export default function Newsfeed() {
  const location = useLocation();
  const { Data } = useContext(UserDataContext);
  const currentUserId = Data?._id || Data?._id;
  
  // Determine feed type from URL
  const activeFeed = location.pathname.replace("/", "") || "feed";
  const token = localStorage.getItem("user_token");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch posts using Infinite Query based on active feed type
  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['posts', activeFeed, currentUserId],
    staleTime: 0, // 0 ensures background refetch on every visit/focus
    queryFn: async ({ pageParam = 1 }) => {
      if (activeFeed === "my-posts" && currentUserId) {
        return getUserPosts(token, currentUserId, 20, pageParam);
      }
      if (activeFeed === "saved") {
        const savedIds = JSON.parse(localStorage.getItem("saved_posts") || "[]").reverse(); // newest first
        const pageIds = savedIds.slice((pageParam - 1) * 20, pageParam * 20);
        if (pageIds.length === 0) {
          return { message: "success", data: [], total: savedIds.length };
        }
        const posts = await Promise.all(
          pageIds.map(async (id: string) => {
            try {
              const res = await getSinglePost(token, id);
              return res.data;
            } catch (e) {
              return null;
            }
          })
        );
        return { message: "success", data: posts.filter(Boolean), total: savedIds.length };
      }
      return getPosts(token, 20, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const currentCount = (lastPageParam - 1) * 20 + (lastPage.data?.length || 0);
      return currentCount < (lastPage.total || 0) && (lastPage.data?.length || 0) > 0 ? lastPageParam + 1 : undefined;
    },
  });

  const postsData = data?.pages.flatMap(page => page.data) || [];
  
    // Update the local cache when a new post is created
    const handlePostCreated = (newPost: Post) => {
    queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      const newPages = [...oldData.pages];
      if (newPages.length > 0) {
        newPages[0] = {
          ...newPages[0],
          data: [newPost, ...newPages[0].data]
        };
      }
      return { ...oldData, pages: newPages };
    });
  };
    // Update the local cache when a post is deleted
    const handlePostDeleted = (deletedPostId: string, isShare: boolean, sharedPostId?: string) => {
    queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((p: Post) => p._id !== deletedPostId).map((p: Post) => {
            if (isShare && sharedPostId && p._id === sharedPostId) {
              return { ...p, sharesCount: Math.max(0, (p.sharesCount || 0) - 1) };
            }
            return p;
          })
        }))
      };
    });
  };
    // Update the local cache when a post is shared
    const handlePostShared = (sharedPost: Post, originalPostId: string, isShare: boolean, sourceSharedPostId?: string) => {
    queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      const newPages = oldData.pages.map((page: any, index: number) => {
        let updatedPosts = page.data.map((p: Post) => {
          if (p._id === originalPostId || (isShare && sourceSharedPostId && p._id === sourceSharedPostId)) {
            return { ...p, sharesCount: (p.sharesCount || 0) + 1 };
          }
          return p;
        });
        
        if (index === 0) {
          updatedPosts = [sharedPost, ...updatedPosts];
        }
        return { ...page, data: updatedPosts };
      });
      
      return { ...oldData, pages: newPages };
    });
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      <CreatePost onPostCreated={handlePostCreated} />
      
      {status === 'error' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700/60 p-12 mb-5 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-5">
            <AlertCircle className="text-red-500 w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-slate-900 dark:text-white text-[19px] font-bold mb-2">
            {error instanceof Error && error.message.includes('401') ? "Session Expired" : "Something went wrong"}
          </h3>
          <p className="text-slate-500 dark:text-gray-400 text-[15px] mb-8 max-w-[320px] leading-relaxed">
            {error instanceof Error && error.message.includes('401') 
              ? "Your session has expired or is invalid. Please log in again to continue." 
              : error instanceof Error ? error.message : "An error occurred"}
          </p>
          
          {error instanceof Error && error.message.includes('401') ? (
            <button 
              onClick={() => {
                localStorage.removeItem("user_token");
                navigate("/auth/login");
                window.location.reload();
              }} 
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-[15px] shadow-sm hover:shadow-md"
            >
              <LogIn size={18} strokeWidth={2} />
              Log In Again
            </button>
          ) : (
            <button 
              onClick={() => refetch()} 
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-[15px] shadow-sm hover:shadow-md"
            >
              <RefreshCw size={18} strokeWidth={2} />
              Try Again
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          {status === 'pending' ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : postsData.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-12 my-6 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-5">
                <FileText className="text-slate-400 dark:text-slate-500 w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-slate-800 dark:text-slate-100 text-[20px] font-bold mb-2">No Posts Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-[15px] max-w-[300px] leading-relaxed">
                {activeFeed === "my-posts" 
                  ? "You haven't created any posts yet." 
                  : activeFeed === "saved" 
                  ? "You haven't saved any posts yet." 
                  : "There are no posts in the feed right now."}
              </p>
            </div>
          ) : (
            <InfiniteScroll
              dataLength={postsData.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="mt-4">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              }
              endMessage={
                postsData.length > 0 ? (
                  <div className="flex justify-center py-10">
                    <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-1"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-1"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-1"></div>
                  </div>
                ) : null
              }
              style={{ overflow: 'visible' }}
            >
              {postsData?.map((post: Post, index: number) => (

                  <div key={post._id}>
                    <PostCard 
                      priority={index === 0}
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
                      onPostDeleted={() => handlePostDeleted(post._id, !!post.isShare, post.sharedPost?._id)}
                      onPostShared={(sharedPost) => handlePostShared(sharedPost, post._id, !!post.isShare, post.sharedPost?._id)}
                      isShare={post.isShare}
                      reposterId={post.isShare ? post.user._id : undefined}
                      reposterName={post.isShare ? post.user.name : undefined}
                      reposterPhoto={post.isShare ? post.user.photo : undefined}
                      reposterTimeAgo={post.isShare ? formatTimeAgo(post.createdAt) : undefined}
                      reposterContent={post.isShare ? post.body : undefined}
                    />
                  </div>
                )
              )}
            </InfiniteScroll>
          )}
        </div>
      )}
    </div>
  );
}
