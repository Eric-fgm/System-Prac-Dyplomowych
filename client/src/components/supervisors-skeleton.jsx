const SupervisorsSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-4 flex h-12 items-center">
        <div className="sm:basis-[40%] md:basis-[28%]">
          <div className="w-24 h-5 bg-gray-200 rounded-sm" />
        </div>
        <div className="hidden sm:block basis-[18%] lg:basis-[13%]">
          <div className="w-20 h-5 bg-gray-200 rounded-sm" />
        </div>
        <div className="hidden md:block">
          <div className="w-20 h-5 bg-gray-200 rounded-sm" />
        </div>
        <div className="ml-auto">
          <div className="w-16 h-5 bg-gray-200 rounded-sm" />
        </div>
      </div>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="px-4 border-t flex items-center h-20 animate-pulse"
          >
            <div className="flex items-center gap-3 sm:basis-[40%] md:basis-[28%]">
              <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
              <div>
                <div className="w-28 h-5 bg-gray-200 rounded-sm"></div>
                <div className="mt-2 w-20 h-4 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
            <div className="hidden sm:block basis-[18%] lg:basis-[13%]">
              <div className="w-28 h-5 bg-gray-200 rounded-sm" />
            </div>
            <div className="hidden md:block w-32 h-5 bg-gray-200 rounded-sm" />
            <div className="ml-auto">
              <div className="w-10 h-6 bg-gray-200 rounded-sm"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SupervisorsSkeleton;
