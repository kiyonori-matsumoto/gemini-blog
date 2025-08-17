# 静的ブログ開発計画 (v2)

## 1. 概要

Next.jsを使用し、GitHub Actionsと生成AIを活用した自動ブログ投稿機能を備えた「無限ブログ」を構築します。デザインはシンプルかつ洗練されたものを目指します。

## 2. 技術スタック

*   **フレームワーク:** Next.js (Static Site Generation - SSG)
*   **言語:** TypeScript
*   **スタイリング:** Tailwind CSS (ミニマリストでクリーンなデザイン、システム設定に応じたダークモード対応)
*   **CI/CD & 自動化:** GitHub Actions, Vercel
*   **コンテンツ生成:** 生成AI (例: Gemini API)

## 3. 主な機能

*   **記事管理:**
    *   リポジリポジトリ内のMarkdownファイルで記事を管理。
*   **静的サイト生成:**
    *   MarkdownファイルをHTMLに変換し、静的なブログサイトを生成。
*   **自動ブログ投稿ワークフロー:**
    *   GitHub issueが作成されるとGitHub Actionsがトリガーされる。
    *   Node.jsスクリプトがIssueの内容を元に生成AI (Gemini API) を呼び出し、ブログ記事(Markdown)を生成。
    *   生成AIは、ファイル名、フロントマター（タイトルと現在の日付を含む）、および記事本文をMarkdown形式で生成する。記事本文にはH1見出しは含まれない。
    *   スクリプトは、生成された記事の先頭に余分な改行がないことを保証し、フロントマターの日付が常に現在の日付になるように自動的に置換する。
    *   生成された記事を`posts`ディレクトリに保存し、`main`ブランチに自動でプッシュ。
*   **自動デプロイ:**
    *   `main`ブランチへのプッシュをトリガーに、VercelのCI/CD機能が自動でサイトをビルド・デプロイ。
*   **SNS共有ボタン:**
    *   各記事ページにTwitter (X) および Facebook の共有ボタンを設置。
    *   アイコン表示で、ホバー時にテキストが表示されるUI。
    *   共有URLは `https://ai-blog.matsukiyo.me` を使用。
*   **「このブログについて」ページ:**
    *   ブログが生成AIによって自動生成されていること、および内容の正確性が保証されない旨を説明するページを新規作成。
    *   トップページからリンク。
*   **記事表示の調整:**
    *   記事の行間を調整し、読みやすさを向上。
    *   記事タイトルのサイズを調整。
    *   Tailwind CSSの`prose`クラスの適用問題を修正。

## 4. ディレクトリ構成

```
/
├── .github/
│   └── workflows/
│       └── issue-to-post.yml # issueからブログを生成する用
├── posts/                  # ブログ記事 (Markdown)
├── scripts/                # 自動化用スクリプト
│   └── generate-post.mjs
├── src/                    # Next.js アプリケーション
└── GEMINI.md
```

## 5. ホスティング

**推奨:** **Vercel**
*   Next.jsとの親和性が非常に高く、GitHubリポジトリを連携させるだけでCI/CDが自動で設定される。
*   `main`ブランチへのプッシュで自動的にデプロイされ、Pull Requestごとにプレビュー環境も提供される。
*   **ホスティングドメイン:** `https://ai-blog.matsukiyo.me/`

**代替案:**
*   **Netlify:** Vercelと同様に高機能で、静的サイトのホスティングに人気。
*   **GitHub Pages:** シンプルな静的サイトを無料でホスティングするのに適している。

## 6. Next.js 15 特記事項

Next.js 15では、動的ルートのページコンポーネントに渡される `params` プロパティが `Promise` となりました。

*   **Server Component の場合:** `async` 関数としてコンポーネントを定義し、`params` を `await` して値を取得する必要があります。
    ```typescript
    export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
      const { slug } = await params;
      // ...
    }
    ```
*   **`generateStaticParams` との併用:** `generateStaticParams` を使用して静的生成を行う場合でも、ページコンポーネントの `params` は `Promise` として扱われます。そのため、上記と同様に `await` が必要です。

この変更は、Next.js 14以前のバージョンとは異なるため、注意が必要です。
