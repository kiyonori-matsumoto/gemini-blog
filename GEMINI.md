# 静的ブログ開発計画 (v2)

## 1. 概要

Next.jsを使用し、GitHub Actionsと生成AIを活用した自動ブログ投稿機能を備えた静的ブログを構築します。デザインはシンプルかつ洗練されたものを目指します。

## 2. 技術スタック

*   **フレームワーク:** Next.js (Static Site Generation - SSG)
*   **言語:** TypeScript
*   **スタイリング:** Tailwind CSS (ミニマリストでクリーンなデザイン)
*   **CI/CD & 自動化:** GitHub Actions, Vercel
*   **コンテンツ生成:** 生成AI (例: Gemini API)

## 3. 主な機能

*   **記事管理:**
    *   リポジトリ内のMarkdownファイルで記事を管理。
*   **静的サイト生成:**
    *   MarkdownファイルをHTMLに変換し、静的なブログサイトを生成。
*   **自動ブログ投稿ワークフロー:**
    *   GitHub issueが作成されるとGitHub Actionsがトリガーされる。
    *   Node.jsスクリプトがIssueの内容を元に生成AI (Gemini API) を呼び出し、ブログ記事(Markdown)を生成。
    *   生成された記事を`posts`ディレクトリに保存し、`main`ブランチに自動でプッシュ。
*   **自動デプロイ:**
    *   `main`ブランチへのプッシュをトリガーに、VercelのCI/CD機能が自動でサイトをビルド・デプロイ。

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

**代替案:**
*   **Netlify:** Vercelと同様に高機能で、静的サイトのホスティングに人気。
*   **GitHub Pages:** シンプルな静的サイトを無料でホスティングするのに適している。
