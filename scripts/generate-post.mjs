import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

async function generatePost() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const issueTitle = process.env.ISSUE_TITLE;
  const issueBody = process.env.ISSUE_BODY;

  if (!issueTitle || !issueBody) {
    throw new Error("ISSUE_TITLE or ISSUE_BODY is not set");
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}-${month}-${day}`;

  const genAI = new GoogleGenAI({ apiKey });

  const prompt = `
    以下のブログ記事をJSON形式で生成してください。
    JSONオブジェクトは以下のキーを持つ必要があります:
    - "filename": 記事の内容を簡潔に表す英語のケバブケースのファイル名（例: "my-first-post.md"）。
    - "title": 記事のタイトル。
    - "tags": 記事の内容を表すハッシュタグの配列（最大5個、最低3個は汎用的なタグ）。
    - "content": Markdown形式のブログ記事本文。H1見出しは含めないでください。

    **執筆者プロフィール: 山田太郎 (Taro Yamada)**
    現場のリアリズムとビジネス価値を最優先するソフトウェアアーキテクト。
    大手Webサービス企業にて、数々の修羅場をテックリードとしてくぐり抜けてきた。
    「正論だけのアーキテクチャ」や「形骸化したレビュープロセス」が、エンジニアの意欲を削ぎ、組織の機動力を殺す現場を数多く目撃。
    単に綺麗なコードを書くことよりも、エンジニアがいかに「説明コスト」という無駄な重圧から解放され、最速で本質的な価値（ビジネスへの貢献）を届けられるかを信条とする。
    特に、過剰な承認フローや厳格すぎるレビューが、結果として「ライブラリ選定を避けて車輪の再発明をする」といった不健全な回避行動を招く技術的官僚主義に対し、強い危機感を持っている。
    AIを「魔法」ではなく、人間系プロセスの泥臭い無駄を排除し、創造性をブーストするための「冷徹かつ強力な合理化ツール」と定義。
    専門はアーキテクチャ設計、ドメイン駆動設計（DDD）、およびAI/LLMの実践的導入。

    **記事のトーンとスタイル:**
    *   現場の痛みを知るアーキテクトとしての、鋭く実践的な視点。
    *   理想論に終始せず、技術選定の背後にある「人間心理」や「組織の力学」に踏み込んだ内容。
    *   「なぜそれが必要か」だけでなく、「それをしないと、どのような負の連鎖（組織の劣化）が起きるか」という警告を含める。
    *   最新技術の導入効果を、開発者の心理的ハードルの低減や、意思決定スピードの向上という文脈で語る。

    **ルール:**
    *   文中の強調には、アスタリスク1つで囲む形式（例: *強調したいテキスト*）を使用し、<em> タグとしてレンダリングされるようにしてください。ただし、見出しやリストのタイトルなど、構造的に太字にすべき箇所には、アスタリスク2つで囲む形式（例: **太字のテキスト**）を使用してください。
    *   生成されるJSONは、余分な改行やコメントを含まず、厳密にJSON形式である必要があります。

    **記事のテーマ:**
    ${issueTitle}

    **記事の概要:**
    ${issueBody}
  `;

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          filename: { type: "string" },
          title: { type: "string" },
          tags: { type: "array", items: { type: "string" }, maxItems: 5 },
          content: { type: "string" },
        },
        required: ["filename", "title", "tags", "content"],
      },
    },
  });
  const text = response.text; // This will now be a JSON string

  let parsedContent;
  try {
    parsedContent = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", e);
    console.error("AI response text:", text);
    throw new Error("Invalid JSON response from AI.");
  }

  const fileName = parsedContent.filename;
  const title = parsedContent.title;
  const date = parsedContent.date;
  const tags = parsedContent.tags;
  const content = parsedContent.content;

  // Construct the final Markdown content with front matter
  const finalContent = `---
title: ${title}
date: ${currentDate}
tags: [${tags.join(", ")}]
---

${content}`;

  const fullPath = path.join(postsDirectory, fileName);
  fs.writeFileSync(fullPath, finalContent);

  console.log("Generated post: " + fileName);
}

if (process.env.NODE_ENV !== "test") {
  generatePost();
}

export { generatePost };
