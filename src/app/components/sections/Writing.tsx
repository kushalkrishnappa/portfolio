import Link from "next/link";
import { getLatestPosts } from "@/lib/blog";
import SectionHeader from "@/app/components/SectionHeader";

export default async function Writing() {
  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="mb-16 sm:mb-20">
      <SectionHeader command="ls -t ~/blog | head -3" />
      <div className="pl-4 border-l-2 border-gray-700 space-y-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex justify-between items-baseline gap-4">
              <h3 className="text-white font-bold">{post.title}</h3>
              <span className="text-gray-500 text-xs shrink-0 whitespace-nowrap tabular-nums">
                {post.date}
              </span>
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
          </a>
        ))}
        <Link href="/blogs" className="inline-block text-cyan-400 text-sm hover:text-cyan-300">
          see all →
        </Link>
      </div>
    </section>
  );
}
