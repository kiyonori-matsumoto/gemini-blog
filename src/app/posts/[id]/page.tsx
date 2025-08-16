import { getPostData } from '@/lib/posts';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function Post({ params }: PostPageProps) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.id);
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{postData.title}</h1>
      <div className="text-gray-500 mb-4 dark:text-gray-300">
        {postData.date}
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}