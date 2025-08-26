import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // URLクエリパラメータからタイトルを取得
    const title = searchParams.get('title') || 'Default Title';

    // 日本語フォントの読み込み
    // public/fonts/NotoSansJP-Bold.ttf に配置したフォントファイルを指定してください
    const fontData = await fetch(
      new URL('/fonts/NotoSansJP-Bold.ttf', req.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1A202C', // 背景色 (Tailwind gray-900に近い)
            color: '#FFFFFF', // テキスト色 (白)
            fontFamily: '"Noto Sans JP"', // フォントファミリー
            padding: '50px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '1.2',
              marginBottom: 'auto', // 上部に寄せる
              marginTop: 'auto', // 下部に寄せる
              maxWidth: '90%', // タイトルが長すぎてもはみ出さないように
              wordBreak: 'break-word', // 長い単語の折り返し
            }}
          >
            {title}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '50px',
              fontSize: '32px',
              color: '#0D9488', // Tailwind teal-600
            }}
          >
            {/* 👈 ここにご自身のブログ名を入れてください */}
            無限ブログ
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans JP',
            data: fontData,
            style: 'normal',
            weight: 700, // Bold
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
