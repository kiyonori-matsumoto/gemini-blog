import {
  GoogleGenerativeAI,
} from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'posts');

async function generatePost() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }

  const issueTitle = process.env.ISSUE_TITLE;
  const issueBody = process.env.ISSUE_BODY;

  if (!issueTitle || !issueBody) {
    throw new Error('ISSUE_TITLE or ISSUE_BODY is not set');
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const prompt = `
    以下のブログ記事を生成してください。

    **ルール:**

    *   ブログのタイトルはH1見出し(---で囲む)にしてください。
    *   ファイル名は、記事の内容を簡潔に表す英語のケバブケースにしてください。(例: my-first-post.md)
    *   記事の本文はMarkdown形式で記述してください。
    *   記事の最初には、frontmatterとしてtitleを記述してください。
    *   生成するコンテンツは、ファイル名と記事の本文のみにしてください。
    *   ファイル名の後に、改行を一つ入れてください。

    **記事のテーマ:**
    ${issueTitle}

    **記事の概要:**
    ${issueBody}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  const firstLine = text.split('\n')[0];
  const fileName = firstLine.trim();
  const content = text.substring(text.indexOf('\n') + 1);

  const finalContent = `---\ndate: '${currentDate}'
---\n
${content}`;

  const fullPath = path.join(postsDirectory, fileName);
  fs.writeFileSync(fullPath, finalContent);

  console.log(`Generated post: ${fileName}`);
}

generatePost();
