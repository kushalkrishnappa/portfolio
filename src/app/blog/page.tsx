import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";

export const metadata: Metadata = {
  title: "Blog — Kushal Krishnappa",
  description: "Writing on distributed systems, infrastructure automation, and security.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-12 sm:pt-20 pb-16">
        <SectionHeader command="ls ~/blog" />
        <div className="pl-4 border-l-2 border-gray-700">
          {posts.length === 0 ? (
            <div className="bg-gray-900 border border-dashed border-yellow-600/60 rounded-lg p-8 text-center">
              <p className="text-yellow-400 text-base mb-2">⚠ Working on it…</p>
              <p className="text-gray-500 text-sm">
                Writing my first posts on distributed systems, infrastructure automation, and
                security. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-baseline">
                    <h2 className="text-white font-bold">{post.title}</h2>
                    <span className="text-gray-500 text-xs">{post.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm my-2">{post.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs border border-gray-700 rounded px-2 py-0.5 text-cyan-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
