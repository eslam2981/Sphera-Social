export default function ProfileSkeleton() {
  return (
    <div className="w-full mx-auto animate-pulse">
      {/* Back button placeholder */}
      <div className="py-3 px-2 flex items-center mb-2">
        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>

      {/* Cover Photo Skeleton */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-none sm:rounded-b-3xl bg-slate-200 dark:bg-slate-800"></div>

      <div className="px-4 sm:px-8 relative">
        {/* Profile Info Header */}
        <div className="flex flex-row items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
          {/* Avatar */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-full border-4 border-[#F0F2F5] dark:border-slate-900 bg-slate-300 dark:bg-slate-700"></div>
          {/* Action button */}
          <div className="w-24 sm:w-32 h-10 bg-slate-200 dark:bg-slate-800 rounded-full mb-2 sm:mb-4"></div>
        </div>

        {/* User Details */}
        <div className="mb-8 space-y-4">
          <div className="h-8 w-48 sm:w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          
          <div className="flex gap-4 mt-6">
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
          
          <div className="flex gap-6 mt-4">
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 mb-6 flex gap-8">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2"></div>
        </div>
      </div>
    </div>
  );
}
