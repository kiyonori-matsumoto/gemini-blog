# 無限ブログ (v2)

Next.js、GitHub Actions、生成AI (Gemini API) を活用した静的ブログ「無限ブログ」です。Issueを作成するだけでブログ記事が自動生成され、Vercelに自動デプロイされます。

## ✨ 主な機能

*   **記事管理:** リポジトリ内のMarkdownファイルで記事を管理します。
*   **静的サイト生成:** MarkdownファイルをHTMLに変換し、静的なブログサイトを生成します。
*   **自動ブログ投稿ワークフロー:**
    *   GitHub Issueが作成されるとGitHub Actionsがトリガーされます。
    *   Issueの内容を元に生成AI (Gemini API) がブログ記事(Markdown)を生成します。
    *   生成AIは、ファイル名、フロントマター（タイトルと現在の日付を含む）、および記事本文をMarkdown形式で生成します。記事本文にはH1見出しは含まれません。
    *   スクリプトは、生成された記事の先頭に余分な改行がないことを保証し、フロントマターの日付が常に現在の日付になるように自動的に置換します。
    *   生成された記事は`posts`ディレクトリに保存され、`main`ブランチに自動でプッシュされます。
*   **自動デプロイ:** `main`ブランチへのプッシュをトリガーに、VercelのCI/CD機能が自動でサイトをビルド・デプロイします。
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
*   **ダークモード対応:** システム設定に応じたダークモードをサポートします。

## 🛠️ 技術スタック

*   **フレームワーク:** Next.js (Static Site Generation - SSG)
*   **言語:** TypeScript
*   **スタイリング:** Tailwind CSS
*   **CI/CD & 自動化:** GitHub Actions, Vercel
*   **コンテンツ生成:** Google Gemini API

## 🚀 セットアップ

1.  **リポジトリをクローン:**
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2.  **依存関係のインストール:**
    ```bash
    npm install
    ```

3.  **開発サーバーの起動:**
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:3000` を開くと、「無限ブログ」のサイトが表示されます。

## ⚙️ 環境設定

### GitHub Secrets

自動ブログ投稿ワークフローを機能させるには、GitHubリポジトリのSecretsに`GEMINI_API_KEY`を設定する必要があります。

1.  [Google AI Studio](https://aistudio.google.com/) でGemini APIキーを取得します。
2.  GitHubリポジトリの `Settings` > `Secrets and variables` > `Actions` に移動します。
3.  `New repository secret` をクリックし、**Name:** `GEMINI_API_KEY`、**Secret:** 取得したAPIキー を設定します。

### Vercel デプロイ

Vercelにデプロイするには、GitHubリポジトリをVercelプロジェクトに連携させるだけです。

1.  [Vercel](https://vercel.com/new) にアクセスし、本リポジトリをインポートして新しいプロジェクトを作成します。
2.  `main`ブランチへのプッシュで自動的にデプロイされるように設定されていることを確認してください。
3.  **ホスティングドメイン:** `https://ai-blog.matsukiyo.me/`

## 📝 自動ブログ投稿の使い方

1.  GitHubリポジトリの「Issues」タブに移動します。
2.  新しいIssueを作成します。
    *   **タイトル:** ブログ記事のタイトルになります。
    *   **本文:** ブログ記事の概要や、Geminiに生成してほしい内容を記述します。
3.  Issueを作成すると、GitHub Actionsが自動的にトリガーされ、Gemini APIが呼び出されて記事が生成されます。
4.  生成された記事は`posts/`ディレクトリに新しいMarkdownファイルとして追加され、`main`ブランチにコミットされます。
5.  `main`ブランチへのコミットをトリガーに、Vercelが自動的にサイトをビルド・デプロイし、新しい記事が公開されます。

## 💡 ダークモード

本ブログは、システム設定に応じたダークモードをサポートしています。お使いのOSの表示設定（ライトモード/ダークモード）を切り替えることで、ブログのデザインも自動的に切り替わります。