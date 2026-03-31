function SkeletonLoader({ count = 1, height = 'h-12' }) {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`${height} bg-dark-700 rounded-lg animate-pulse`}
          />
        ))}
    </div>
  )
}

export default SkeletonLoader
