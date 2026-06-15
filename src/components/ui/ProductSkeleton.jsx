export default function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-4 space-y-4">
      <div className="bg-gray-300 h-40 rounded-lg"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-8 bg-gray-300 rounded"></div>
    </div>
  );
}