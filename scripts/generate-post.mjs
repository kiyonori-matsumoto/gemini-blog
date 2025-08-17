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

    *   最初の行は、記事の内容を簡潔に表す英語のケバブケースのファイル名にしてください。(例: my-first-post.md)
    *   ファイル名の後に、改行を一つ入れてください。
    *   その後の内容は、Markdown形式のブログ記事本文にしてください。
    *   ブログ記事本文の先頭には、以下の形式のYAMLフロントマターを含めてください。
        ---
        title: [記事のタイトル]
        date: YYYY-MM-DD
        ---
        dateは必ず今日のYYYY-MM-DD形式の日付にしてください。
    *   YAMLフロントマターの直後には、記事の本文を記述してください。H1見出しは不要です。

    **記事のテーマ:**
    ${issueTitle}

    **記事の概要:**
    ${issueBody}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const firstLine = text.split('\n')[0];
  const fileName = firstLine.trim();
  const content = text.substring(text.indexOf('\n') + 1).replace(/^(?:\s*\n)*/, '').trim();

  const finalContent = content.replace(/date: \d{4}-\d{2}-\d{2}/, `date: ${currentDate}`);

  const fullPath = path.join(postsDirectory, fileName);
  fs.writeFileSync(fullPath, finalContent);

  console.log("Generated post: " + fileName);
}

generatePost();
