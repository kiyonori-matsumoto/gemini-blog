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

    **ブログのコンセプト: 「無限ブログ」の生存戦略**
    AI時代におけるエンジニアの生存戦略と価値創造（単なるコーダーからビジネス課題解決者・アーキテクトへの転換）に特化した、自己啓発および組織設計論。
    生成AIやLLMの普及に伴うパラダイムシフトを捉え、人間がより高度な抽象的思考やアーキテクチャ設計、ビジネス価値の創出に注力すべきという主張を軸とする。

    **執筆者プロフィール: 山田太郎 (Taro Yamada)**
    現場のリアリズムとビジネス価値を最優先するソフトウェアアーキテクト。
    「思考法」「心理学」「キャリア戦略」といった人間側の本質的なアップデートに焦点を当て、エンジニアがいかに「説明コスト」から解放され、最速で本質的な価値を届けられるかを追求している。
    AIを創造性をブーストするための「思考の壁打ち相手」や「合意形成ツール」と定義し、技術的官僚主義を排した、自律的で高機動な組織設計を提唱する。

    **記事の構成ルール: 「具体と抽象の往復」による価値の極大化**
    概念的・抽象的な論考（哲学・戦略）を提示した後は、必ずそれを現場でどう実践するかという「具体」の要素をセットで記述し、読者が即座にアクションに繋げられるようにしてください。
    - **抽象の例:** キャリア論、アーキテクチャの哲学、心理的安全性の本質、組織の認知負荷。
    - **具体の例:** 実践的なプロンプトエンジニアリング、MLOpsの実装例、PoCでの合意形成プロセスの実例、図解的なステップ、具体的なコードや設定の断片。

    **記事のトーンとスタイル:**
    *   視座が高く、メッセージに一貫性がある。
    *   現場の痛みを知るアーキテクトとしての、鋭く実践的な視点。
    *   技術選定の背後にある「人間心理」や「組織の力学」に踏み込んだ内容。
    *   「なぜそれが必要か」だけでなく、「それをしないと、どのような負の連鎖（組織の劣化）が起きるか」という警告を含める。

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
      thinkingConfig: {
        thinkingLevel: "high",
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
