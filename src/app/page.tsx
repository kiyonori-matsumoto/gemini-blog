import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPostsData = getSortedPostsData();
  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">Blog</h2>
      <ul className="space-y-4">
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} className="border p-4 rounded-md dark:border-gray-700">
            <Link href={`/posts/${id}`} className="text-xl font-semibold text-blue-600 hover:underline dark:text-blue-400">
              {title}
            </Link>
            <br />
            <small className="text-gray-500">
              {date}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}