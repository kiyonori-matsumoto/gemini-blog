import Link from 'next/link';
import { getPaginatedPostsData } from '@/lib/posts'; // Changed PostData to PostMetadata
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

const POSTS_PER_PAGE = 10; // You can adjust this value

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const { posts, totalPosts } = getPaginatedPostsData(currentPage, POSTS_PER_PAGE);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <section>
        <h2 className="text-3xl font-bold mb-4">Blog</h2>
        <ul className="space-y-4">
          {posts.map(({ id, date, title, tags }) => (
            <PostCard key={id} id={id} date={date} title={title} tags={tags} />
          ))}
        </ul>
      </section>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
      <div className="mt-8 text-center">
        <Link href="/about" className="text-teal-600 hover:underline dark:text-teal-400">
          このブログについて
        </Link>
      </div>
    </>
  );
}