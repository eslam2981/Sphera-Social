/** Renders the post card skeleton component. */
export default function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-800 mb-5 overflow-hidden">
      {}
      <div className="flex justify-between items-start p-4">
        <div className="flex gap-3.5 items-center w-full">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>

      {}
      <div className="px-4 pb-4 flex flex-col gap-2.5">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/6 animate-pulse"></div>
      </div>

      {}
      <div className="w-full h-[350px] bg-slate-100 dark:bg-slate-800 animate-pulse border-y border-slate-100 dark:border-slate-800"></div>

      {}
      <div className="flex items-center justify-between py-3 px-4 mx-4 border-b border-slate-100 dark:border-slate-800 h-[44px]">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 animate-pulse"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 animate-pulse"></div>
        </div>
      </div>

      {}
      <div className="flex items-center justify-between px-2 py-1 m-2">
        <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg mx-1 animate-pulse"></div>
        <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg mx-1 animate-pulse"></div>
        <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg mx-1 animate-pulse"></div>
      </div>
    </div>
  );
}
