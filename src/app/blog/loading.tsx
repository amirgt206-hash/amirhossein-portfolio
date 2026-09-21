export default function Loading() {
  return (
    <main id="main" className="blog-page">
      <div className="container">
        <div className="blog-back-home-skeleton" />
        <div className="blog-header-skeleton">
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line skeleton-line-lg" />
          <div className="skeleton-line skeleton-line-md" />
        </div>
        <div className="blog-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="blog-card-skeleton">
              <div className="skeleton-line skeleton-line-sm" />
              <div className="skeleton-line skeleton-line-md" />
              <div className="skeleton-line skeleton-line-lg" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}