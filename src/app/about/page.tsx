import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'このブログについて | 無限ブログ',
};

export default function AboutPage() {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">このブログについて</h1>
      <p>
        このブログは、生成AI（Gemini API）によって自動生成された記事で構成されています。
        GitHub Actionsのワークフローを通じて、特定のトリガーに基づいてAIが記事を執筆し、自動的に公開しています。
      </p>
      <p>
        そのため、記事の内容はAIが生成したものであり、その正確性、完全性、信頼性、有用性について、当ブログは一切保証するものではありません。
        また、AIの学習データや生成プロセスに起因する、意図しない情報や表現が含まれる可能性もございます。
      </p>
      <p>
        本ブログの情報を利用される際は、ご自身の判断と責任において行ってください。
        当ブログの利用によって生じたいかなる損害についても、当ブログは責任を負いかねますので、あらかじめご了承ください。
      </p>
      <p>
        このブログは、生成AIの可能性と限界を探求するための実験的な試みです。
        ご理解の上、お楽しみいただければ幸いです。
      </p>
    </article>
  );
}