import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyMe from "@/components/WhyMe";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import RevealObserver from "@/components/RevealObserver";

/* ── Heavy client component — lazy-loaded with SSR kept on for SEO ── */
const Portfolio = dynamic(() => import("@/components/Portfolio"), {
  ssr: true,
  loading: () => (
    <section
      className="section portfolio-section"
      aria-busy="true"
      aria-label="در حال بارگذاری نمونه‌کارها"
    >
      <div className="container">
        <div className="lazy-skeleton-grid" aria-hidden="true">
          <div className="lazy-skeleton-card" />
          <div className="lazy-skeleton-card" />
          <div className="lazy-skeleton-card" />
        </div>
      </div>
    </section>
  ),
});

export default function Home() {
  return (
    <>
      <Nav />
      <MobileNav />

      <main id="main">
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <WhyMe />
        <LatestBlogPosts />
        <FinalCTA />
      </main>

      <Footer />
      <BackToTop />
      <RevealObserver />
    </>
  );
}