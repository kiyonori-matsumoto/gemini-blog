import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

interface TagPageProps {
  params: { tag: string };
}

export default async function TagPage({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag);
  const allPostsData = getSortedPostsData();

  const filteredPosts = allPostsData.filter(post =>
    post.tags.includes(decodedTag)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">タグ: {decodedTag}</h1>
      <ul className="space-y-4">
        {filteredPosts.map(({ id, date, title, tags }) => (
          <PostCard key={id} id={id} date={date} title={title} tags={tags} />
        ))}
      </ul>
    </div>
  );
}

export async function generateStaticParams() {
  const allPostsData = getSortedPostsData();
  const tags = new Set<string>();
  allPostsData.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).map(tag => ({
    tag: encodeURIComponent(tag),
  }));
}
