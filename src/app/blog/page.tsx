import Image from "next/image";
import Link from "next/link";
import { getPosts, getMedia, stripHtml, formatDate, WordPressPost } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Fattore F - Ricette, Consigli e Segreti della Panificazione | Bakery Vicenza",
  description: "Scopri i segreti della panificazione artigianale nel blog di Fattore F. Ricette, consigli professionali e tecniche per pizza, pane e lievitati. La miglior pizzeria di Vicenza condivide la sua esperienza.",
};

interface BlogPostWithMedia extends WordPressPost {
  featuredImage?: {
    url: string;
    alt: string;
  };
}

async function getPostsWithMedia(): Promise<BlogPostWithMedia[]> {
  const posts = await getPosts({ per_page: 10 });
  
  const postsWithMedia = await Promise.all(
    posts.map(async (post) => {
      let featuredImage = undefined;
      
      if (post.featured_media) {
        const media = await getMedia(post.featured_media);
        if (media) {
          featuredImage = {
            url: media.source_url,
            alt: media.alt_text || stripHtml(post.title.rendered),
          };
        }
      }
      
      return {
        ...post,
        featuredImage,
      };
    })
  );
  
  return postsWithMedia;
}

export default async function BlogPage() {
  const posts = await getPostsWithMedia();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden bg-[#f8f8f8]">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="text-[#4e4e4e] text-center uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: '"Druk Wide", sans-serif',
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: "1.1",
            }}
          >
            <span className="block">IL NOSTRO</span>
            <span className="block">BLOG</span>
          </h1>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p 
                className="text-[#4e4e4e] text-xl md:text-2xl"
                style={{
                  fontFamily: "Bogart, sans-serif",
                  fontWeight: 300,
                }}
              >
                Non ci sono ancora articoli pubblicati.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Featured Image */}
                    {post.featuredImage ? (
                      <div className="relative w-full h-64 md:h-72 overflow-hidden mb-6">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 md:h-72 bg-[#f8f8f8] flex items-center justify-center mb-6">
                        <div className="text-[#b71918] text-6xl">
                          📝
                        </div>
                      </div>
                    )}

                    {/* Post Content */}
                    <div>
                      {/* Date */}
                      <time 
                        className="text-[#b71918] text-sm font-medium uppercase tracking-wider mb-3 block"
                        style={{ fontFamily: "Bogart, sans-serif" }}
                      >
                        {formatDate(post.date)}
                      </time>

                      {/* Title */}
                      <h2 
                        className="text-[#4e4e4e] font-bold mb-4 leading-tight text-xl md:text-2xl group-hover:text-[#b71918] transition-colors"
                        style={{
                          fontFamily: '"Druk Text Cyr", sans-serif',
                          fontWeight: 500,
                          lineHeight: "1.2",
                        }}
                      >
                        {stripHtml(post.title.rendered)}
                      </h2>

                      {/* Excerpt */}
                      <p 
                        className="text-[#4e4e4e] leading-relaxed mb-4"
                        style={{
                          fontFamily: "Bogart, sans-serif",
                          fontWeight: 300,
                          lineHeight: "1.6",
                        }}
                      >
                        {stripHtml(post.excerpt.rendered).substring(0, 150)}...
                      </p>

                      {/* Read More */}
                      <span 
                        className="text-[#b71918] font-medium uppercase tracking-wider text-sm group-hover:underline"
                        style={{ fontFamily: "Bogart, sans-serif" }}
                      >
                        Leggi tutto →
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-12 md:mt-16">
            <Link 
              href="/"
              className="bg-[#b71918] text-[#ffffff] px-8 py-4 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors inline-block text-lg md:text-xl"
              style={{
                color: "#ffffff",
                fontFamily: '"Druk Text Cyr", sans-serif',
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "1.4",
              }}
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour 