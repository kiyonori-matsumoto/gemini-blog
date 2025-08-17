import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface PostData {
  id: string;
  contentHtml: string;
  title: string;
  date: string;
  tags: string[];
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    const tags = Array.isArray(matterResult.data.tags)
      ? (matterResult.data.tags as string[]).map(tag => String(tag).trim()).filter(tag => tag.length > 0)
      : [];
    const date = matterResult.data.date instanceof Date ? matterResult.data.date.toISOString().split('T')[0] : String(matterResult.data.date);
    return {
      id,
      title: matterResult.data.title as string,
      date,
      tags,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  const tags = Array.isArray(matterResult.data.tags)
    ? (matterResult.data.tags as string[]).map(tag => String(tag).trim()).filter(tag => tag.length > 0)
    : [];
  return {
    id,
    contentHtml,
    title: matterResult.data.title as string,
    date: matterResult.data.date instanceof Date ? matterResult.data.date.toISOString().split('T')[0] : String(matterResult.data.date),
    tags,
  };
}
