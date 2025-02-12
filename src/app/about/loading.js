export default function AboutLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-50">
      <div className="animate-pulse">
        <div className="h-12 bg-neutral-300 w-64 mb-4 rounded"></div>
        <div className="h-6 bg-neutral-200 w-48 rounded"></div>
      </div>
    </div>
  );
}
