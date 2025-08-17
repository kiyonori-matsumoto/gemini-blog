import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default function Home() {
  const allPostsData = getSortedPostsData();
  return (
    <>
      <section>
        <h2 className="text-3xl font-bold mb-4">Blog</h2>
        <ul className="space-y-4">
          {allPostsData.map(({ id, date, title, tags }) => (
            <PostCard key={id} id={id} date={date} title={title} tags={tags} />
          ))}
        </ul>
      </section>
      <div className="mt-8 text-center">
        <Link href="/about" className="text-teal-600 hover:underline dark:text-teal-400">
          このブログについて
        </Link>
      </div>
    </>
  );
}