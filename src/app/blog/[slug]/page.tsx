import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/app/components/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.meta.title} — Kushal Krishnappa`,
    description: post.meta.summary,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pt-12 sm:pt-20 pb-16">
        <Link href="/blog" className="text-cyan-400 text-sm hover:text-cyan-300">
          ← cd ~/blog
        </Link>
        <article className="pl-4 border-l-2 border-gray-700 mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{meta.title}</h1>
          <div className="text-gray-500 text-xs mb-2">
            {meta.date} · {meta.readingTime}
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-gray-700 rounded px-2 py-0.5 text-cyan-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </div>
    </div>
  );
}
