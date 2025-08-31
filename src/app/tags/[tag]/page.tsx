import { getPostsByTag, getAllTags } from '@/lib/posts'; // Changed PostData to PostMetadata
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';

const POSTS_PER_PAGE = 10; // Consistent with the main page

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = decodeURIComponent(resolvedParams.tag);
  return {
    title: `タグ: ${tag} | 無限ブログ`,
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const decodedTag = decodeURIComponent(decodeURIComponent(resolvedParams.tag));
  const currentPage = Number(resolvedSearchParams.page) || 1;

  const { posts, totalPosts } = getPostsByTag(decodedTag, currentPage, POSTS_PER_PAGE);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">タグ: {decodedTag}</h1>
      <ul className="space-y-4">
        {posts.map(({ id, date, title, tags }) => (
          <PostCard key={id} id={id} date={date} title={title} tags={tags} />
        ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/tags/${encodeURIComponent(decodedTag)}`} />
    </div>
  );
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}