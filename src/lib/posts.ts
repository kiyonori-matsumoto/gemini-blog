import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';

// Interface for post metadata (used in lists)
export interface PostMetadata {
  id: string;
  title: string;
  date: string;
  tags: string[];
}

// Interface for full post data (used in individual post pages)
export interface PostData extends PostMetadata {
  contentHtml: string; // contentHtml is required for full post data
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(): PostMetadata[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

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
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkCjkFriendly)
    .use(remarkGfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

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

export function getPaginatedPostsData(page: number, postsPerPage: number): { posts: PostMetadata[]; totalPosts: number } {
  const allPosts = getSortedPostsData();
  const totalPosts = allPosts.length;
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);
  return { posts, totalPosts };
}

export function getPostsByTag(tag: string, page: number, postsPerPage: number): { posts: PostMetadata[]; totalPosts: number } {
  const allPosts = getSortedPostsData();
  const filteredPosts = allPosts.filter(post => post.tags.includes(tag));
  const totalPosts = filteredPosts.length;
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = filteredPosts.slice(startIndex, endIndex);
  return { posts, totalPosts };
}

export function getAllTags(): string[] {
  const allPosts = getSortedPostsData();
  const tags = new Set<string>();
  allPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}