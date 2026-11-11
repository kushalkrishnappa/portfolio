import FieldManual from "@/app/components/manual/FieldManual";
import Appendices from "@/app/components/manual/sheets/Appendices";
import { getAllPosts } from "@/lib/blog";

/** How many of the latest posts Appendix C lists (the rest live on /blogs). */
const FIELD_NOTES_ON_HOME = 4;

export default async function Home() {
  // Fetched on the server; getAllPosts returns [] when the manifest is empty
  // or unreachable, and Appendix C then shows its quiet empty line.
  const posts = await getAllPosts();
  return <FieldManual appendices={<Appendices posts={posts.slice(0, FIELD_NOTES_ON_HOME)} total={posts.length} />} />;
}
