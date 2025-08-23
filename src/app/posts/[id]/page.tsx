import { getPostData } from '@/lib/posts';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.id);
  return {
    title: `${postData.title} | 無限ブログ`,
  };
}

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function Post({ params }: PostPageProps) {
  const resolvedParams = await params;
  const postData = await getPostData(resolvedParams.id);
  return (
    <article className="prose dark:prose-invert prose-teal mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">{postData.title}</h1>
      <div className="text-gray-500 mb-4 dark:text-gray-300 text-right">
        {new Date(postData.date).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div className="mt-4 mb-6">
        {postData.tags.map(tag => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="inline-block bg-teal-100 dark:bg-teal-700 text-teal-800 dark:text-teal-100 text-xs px-2 py-1 rounded-full mr-2 mb-2 hover:bg-teal-200 dark:hover:bg-teal-600">
            {tag}
          </Link>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      <div className="mt-8 flex justify-end space-x-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(postData.title)}&url=${encodeURIComponent(`https://ai-blog.matsukiyo.me/posts/${postData.id}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center w-10 h-10 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 overflow-hidden transition-all duration-300 ease-in-out hover:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x flex-shrink-0 group-hover:mr-2" viewBox="0 0 16 16">
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
          </svg>
          <span className="sr-only group-hover:not-sr-only">Twitterで共有</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ai-blog.matsukiyo.me/posts/${postData.id}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center w-10 h-10 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-700 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 overflow-hidden transition-all duration-300 ease-in-out hover:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook flex-shrink-0 group-hover:mr-2" viewBox="0 0 16 16">
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.953H10.5c-.988 0-1.293.737-1.293 1.257V8.05h2.159l-.353 2.149H9.157V16c3.823-.604 6.75-3.934 6.75-7.951z"/>
          </svg>
          <span className="sr-only group-hover:not-sr-only">Facebookで共有</span>
        </a>
      </div>
    </article>
  );
}
