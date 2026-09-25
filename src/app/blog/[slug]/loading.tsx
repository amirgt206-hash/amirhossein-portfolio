import { BlogPostSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main id="main" className="blog-post-page">
      <div className="container blog-post-container">
        <div className="blog-back-link" style={{ opacity: 0.4 }}>
          <span aria-hidden="true">→</span>
          بازگشت به بلاگ
        </div>
        <BlogPostSkeleton />
      </div>
    </main>
  );
}