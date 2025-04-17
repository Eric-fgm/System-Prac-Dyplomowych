const ThesisSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-5 border">
      <div className="space-y-4">
        {/* Title, year and status skeleton */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-2 w-full">
            <div className="h-7 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
        </div>

        {/* Metadata skeleton */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="h-5 bg-gray-200 rounded-md w-40 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-36 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>

        {/* Abstract skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>

        {/* Tags skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="h-8 bg-gray-200 rounded-md w-28 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-md w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisSkeleton;
