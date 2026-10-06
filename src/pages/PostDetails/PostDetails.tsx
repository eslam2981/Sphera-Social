import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "../../services/Profile.service";
import PostCard from "../Newsfeed/components/PostCard";
import PostCardSkeleton from "../Newsfeed/components/PostCardSkeleton";
import { ArrowLeft, AlertCircle, LogIn } from "lucide-react";
import { formatTimeAgo } from "../../utils/dateUtils";

/** Renders the post details component. */
export default function PostDetails() {
  /** Renders the { id } component. */
    const { id } = useParams();
  const navigate = useNavigate();

  /** Renders the { data: post, is loading, is error, error } component. */
    const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const token = localStorage.getItem("user_token");
      return await getSinglePost(token, id as string);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <main className="py-6 min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 shadow-sm rounded-lg px-4 py-2 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
          <PostCardSkeleton />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="py-6 min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 shadow-sm rounded-lg px-4 py-2 text-sm font-medium hover:shadow-md"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700/60 p-12 flex flex-col items-center justify-center text-center min-h-[350px]">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-5">
              <AlertCircle className="text-red-500 w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-slate-900 dark:text-white text-[19px] font-bold mb-2">
              {error instanceof Error && error.message.includes('401') ? "Session Expired" : "Error loading post"}
            </h3>
            <p className="text-slate-500 dark:text-gray-400 text-[15px] mb-8 max-w-[320px] leading-relaxed">
              {error instanceof Error && error.message.includes('401') 
                ? "Your session has expired or is invalid. Please log in again to continue." 
                : error instanceof Error ? error.message : "Unknown error"}
            </p>
            
            {error instanceof Error && error.message.includes('401') && (
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
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!post || (!post.post && !post.data && !post.postData)) {
    console.log("Post data received:", post);
    return (
      <div className="text-center py-20 text-slate-500">
        Post not found. Raw data: {JSON.stringify(post)}
      </div>
    );
  }

  const postData = post?.data?.post || post?.post || post?.data || post;

  if (!postData || !postData.user) {
    return (
      <div className="text-center py-20 text-slate-500 overflow-auto">
        <h2 className="text-xl text-red-500 font-bold mb-4">Post not found</h2>
        <p className="text-sm">Could not load the requested post.</p>
      </div>
    );
  }

  return (
    <main className="py-6 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 shadow-sm rounded-lg px-4 py-2 text-sm font-medium hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
        <PostCard
          postId={postData._id}
          authorId={postData.user._id}
          authorName={postData.user.name}
          authorPhoto={postData.user.photo}
          timeAgo={formatTimeAgo(postData.createdAt)}
          content={postData.body}
          imageUrl={postData.image}
          likes={postData.likesCount || 0}
          likesArray={postData.likes || []}
          comments={postData.commentsCount || 0}
          topComment={postData.topComment}
          shares={0}
          onPostDeleted={() => {}}
          onPostShared={() => {}}
        />
      </div>
    </main>
  );
}
