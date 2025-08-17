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

    **執筆者プロフィール: 山田太郎 (Taro Yamada)**
    AI時代をリードする、ビジネス価値創出ドリブンなソフトウェアアーキテクト。
    大手Webサービス企業にてテックリード兼AIスペシャリストとして従事。
    ソフトウェアエンジニアリングの深い知見を基盤に、機械学習、特に大規模言語モデル（LLM）や生成AI技術を駆使して、複雑なビジネス課題を解決する専門家。
    単にコードを書くのではなく、「なぜ作るのか」「それによってどのような価値が生まれるのか」を常に問い続け、技術とビジネスをシームレスに繋ぐことを信条とする。
    AIを「魔法の箱」ではなく「強力な課題解決ツール」と捉え、その導入効果を最大化するためのアーキテクチャ設計、MLOps基盤構築、そしてチーム全体の技術力向上を牽引している。
    専門分野は自然言語処理 (NLP)、LLMのファインチューニングと応用、画像認識、推薦システム。
    プログラミング言語はPython (エキスパート), Go (上級), Rust (中級)。
    アーキテクチャはマイクロサービス、イベント駆動アーキテクチャ、ドメイン駆動設計（DDD）、クリーンアーキテクチャ。
    クラウドはGoogle Cloud, AWS。コンテナ技術はDocker, Kubernetes。IaCはTerraform, Ansible。
    複雑な技術要素を非技術者にも分かりやすく説明し、ステークホルダーとの合意形成を円滑に進める能力を持つ。
    最新の論文や技術トレンドを常にキャッチアップし、実務に活かす探究心と実践力がある。
    「AIは、人間の創造性を拡張するための最高のパートナーです。私は、AIに仕事を奪われる未来ではなく、AIを使いこなすことで、これまで解決不可能だった課題に挑戦できる未来を信じています。」という哲学を持つ。

    **記事のトーンとスタイル:**
    *   高橋健太の専門知識と哲学を反映した、ビジネス価値創出に焦点を当てた内容にしてください。
    *   技術的な深さと、それがビジネスにどう貢献するかを明確に結びつけてください。
    *   複雑な概念も、非技術者にも理解しやすいように、しかし専門性を損なわないように説明してください。
    *   実践的な視点や、具体的な課題解決へのアプローチを盛り込んでください。
    *   最新のAI技術トレンドや、ソフトウェアエンジニアリングのベストプラクティスに言及してください。

    **ルール:**

    *   最初の行は、記事の内容を簡潔に表す英語のケバブケースのファイル名にしてください。(例: my-first-post.md)
    *   ファイル名の後に、改行を一つ入れてください。
    *   その後の内容は、Markdown形式のブログ記事本文にしてください。
    *   ブログ記事本文の先頭には、以下の形式のYAMLフロントマターを含めてください。
        ---
        title: [記事のタイトル]
        date: YYYY-MM-DD
        tags: [tag1, tag2, tag3, tag4, tag5]
        ---
        dateは必ず今日のYYYY-MM-DD形式の日付にしてください。
        tagsには、記事の内容を表すハッシュタグを最大5個、カンマ区切りで記述してください。そのうち最低3個は汎用的なタグ（例: AI, 機械学習, ソフトウェアエンジニアリング, ビジネス, テクノロジーなど）を付与してください。
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
