# We = Synergy

**We = Synergy** は、複数人がそれぞれ出した「キーワード」からランダムに2つを選び、その組み合わせをもとにビジネスアイデアを発想するアイスブレイクアプリです。

## 概要

本アプリは以下の目的で開発されました：

- チームビルディングや授業などで**会話のきっかけを生む**
- ランダムな発想を通して**共創的思考を促す**
- オンラインでも対面でも**リアルタイムで共有体験できる**

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion
- **状態管理**: Zustand
- **バックエンド**: Supabase (PostgreSQL + Edge Functions)
- **認証**: Supabase Auth
- **リアルタイム通信**: Supabase Realtime API
- **デプロイ**: Vercel

## 開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# SupabaseプロジェクトのURL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabaseの匿名キー（公開可能）
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabaseのサービスロールキー（サーバーサイドのみ、秘密にしてください）
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**設定手順:**
1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `supabase-schema.sql` を実行してテーブルを作成
3. 上記の値を実際の値に置き換え
4. `npm run dev` で開発サーバーを起動

### 3. Supabaseデータベースのセットアップ

以下のテーブルを作成してください：

- `users` - ユーザー情報
- `rooms` - ルーム情報
- `keywords` - キーワード情報
- `history` - 抽選履歴

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 機能

- **ルーム作成・参加**: 新しいルームを作成するか、既存のルームに参加
- **キーワード入力**: 各ユーザーがキーワードを入力・送信
- **ランダム抽選**: ルーム内のキーワードから2つをランダムに選出
- **リアルタイム同期**: Supabase Realtime APIによる即座なデータ同期
- **タイマー機能**: 発想制限時間のカウントダウン
- **履歴表示**: 過去の組み合わせ一覧を表示

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
├── components/          # React コンポーネント
├── lib/                 # ユーティリティ・設定ファイル
│   ├── supabase.ts     # Supabase クライアント設定
│   ├── store.ts        # Zustand 状態管理
│   └── utils.ts        # 共通ユーティリティ
└── types/              # TypeScript 型定義
```

## デプロイ

Vercelでのデプロイが最も簡単です：

1. GitHubリポジトリにコードをプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ完了

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します！
