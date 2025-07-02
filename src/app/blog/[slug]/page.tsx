import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getMedia, stripHtml, formatDate } from "@/lib/wordpress";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post non trovato | Fattore F Blog",
      description: "Il post che stai cercando non è stato trovato."
    };
  }

  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const description = excerpt.length > 160 
    ? excerpt.substring(0, 157) + "..." 
    : excerpt;

  let ogImage = "https://fattoref.com/wp-content/uploads/2023/10/fattore-f-bakery-scaled.jpg"; // default image
  
  if (post.featured_media) {
    const media = await getMedia(post.featured_media);
    if (media) {
      ogImage = media.source_url;
    }
  }

  return {
    title: `${title} | Blog Fattore F - Bakery Vicenza`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [ogImage],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  let featuredImage = null;
  if (post.featured_media) {
    const media = await getMedia(post.featured_media);
    if (media) {
      featuredImage = {
        url: media.source_url,
        alt: media.alt_text || stripHtml(post.title.rendered),
      };
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured Image */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-[#f8f8f8] flex items-center justify-center">
            <div className="text-[#b71918] text-8xl">
              📝
            </div>
          </div>
        )}
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Title overlay */}
        <div className="relative z-20 flex items-end justify-center h-full p-8">
          <div className="text-center max-w-4xl">
            <h1
              className="text-white text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4"
              style={{
                fontFamily: '"Druk Text Cyr", sans-serif',
                fontWeight: 500,
                letterSpacing: "0.05em",
                lineHeight: "1.1",
              }}
            >
              {stripHtml(post.title.rendered)}
            </h1>
            <time 
              className="text-white/80 text-lg font-medium uppercase tracking-wider"
              style={{ fontFamily: "Bogart, sans-serif" }}
            >
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <Link 
              href="/blog"
              className="text-[#b71918] font-medium uppercase tracking-wider text-sm hover:underline mb-4 inline-block"
              style={{ fontFamily: "Bogart, sans-serif" }}
            >
              ← Torna al Blog
            </Link>
          </div>

          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none text-[#4e4e4e] blog-content"
            style={{
              fontFamily: "Bogart, sans-serif",
              fontSize: "1.125rem",
              lineHeight: "1.7",
            }}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link 
                href="/blog"
                className="bg-[#b71918] text-[#ffffff] px-6 py-3 font-bold uppercase leading-tight hover:bg-opacity-90 transition-colors text-sm md:text-base"
                style={{
                  color: "#ffffff",
                  fontFamily: '"Druk Text Cyr", sans-serif',
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "1.4",
                }}
              >
                Altri Articoli
              </Link>
              
              <Link 
                href="/"
                className="border border-[#b71918] text-[#b71918] px-6 py-3 font-bold uppercase leading-tight hover:bg-[#b71918] hover:text-white transition-colors text-sm md:text-base"
                style={{
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
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour 