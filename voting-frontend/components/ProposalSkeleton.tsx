export default function ProposalSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Info Box */}
      <div className="bg-gray-100 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full"></div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full"></div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}
