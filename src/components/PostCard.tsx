import Link from 'next/link';

interface PostCardProps {
  id: string;
  date: string;
  title: string;
  tags: string[];
}

export default function PostCard({ id, date, title, tags }: PostCardProps) {
  return (
    <li className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <Link href={`/posts/${id}`} className="text-2xl font-bold text-teal-600 dark:text-teal-400 hover:underline">
        {title}
      </Link>
      <br />
      <small className="text-gray-600 dark:text-gray-400">
        {date}
      </small>
      <div className="mt-2">
        {tags.map(tag => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="inline-block bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-100 text-xs px-2 py-1 rounded-full mr-2 mb-2 hover:bg-teal-200 dark:hover:bg-teal-600">
            {tag}
          </Link>
        ))}
      </div>
    </li>
  );
}
