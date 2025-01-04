export default function RegisterLoading() {
  return (
    <main className="min-h-screen pt-24 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-64 bg-neutral-200 rounded-lg animate-pulse mb-8 mx-auto" />
          <div className="bg-white rounded-2xl p-6">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-10 bg-neutral-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
