import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { getBlogIndexSchema } from "@/lib/schema";
import BlogList from "@/components/BlogList";
import "./blog.css";

export const metadata: Metadata = {
  title: "بلاگ",
  description:
    "مقالات امیرحسین شرکائی درباره طراحی وب، توسعه فرانت‌اند، UI/UX و هوش مصنوعی.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  const blogSchema = getBlogIndexSchema(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
    }))
  );

  return (
    <main id="main" className="blog-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />

      <div className="container">
        <Link href="/" className="blog-back-home">
          <span aria-hidden="true">→</span>
          بازگشت به صفحه اصلی
        </Link>

        <div className="blog-header">
          <span className="section-index">BLOG</span>
          <h1>مقالات و یادداشت‌ها</h1>
          <p>
            درباره طراحی وب، توسعه فرانت‌اند، UI/UX و خلاقیت دیجیتال با کمک
            هوش مصنوعی.
          </p>
        </div>

        <BlogList posts={posts} tags={tags} />
      </div>
    </main>
  );
}