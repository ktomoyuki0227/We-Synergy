-- We = Synergy データベーススキーマ（ver.2：ルーム機能削除版）
-- Supabaseで実行してください

-- ユーザーテーブル（匿名認証対応）
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- キーワードテーブル（グローバルプール）
CREATE TABLE IF NOT EXISTS keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 履歴テーブル（抽選結果）
CREATE TABLE IF NOT EXISTS history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_a TEXT NOT NULL,
  keyword_b TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- リアルタイム機能を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE keywords;
ALTER PUBLICATION supabase_realtime ADD TABLE history;

-- RLS (Row Level Security) ポリシーを設定
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- ユーザーテーブルのポリシー（全員が読み書き可能）
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own user" ON users FOR UPDATE USING (true);

-- キーワードテーブルのポリシー（全員が読み書き可能）
CREATE POLICY "Users can read all keywords" ON keywords FOR SELECT USING (true);
CREATE POLICY "Users can insert keywords" ON keywords FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update keywords" ON keywords FOR UPDATE USING (true);

-- 履歴テーブルのポリシー（全員が読み書き可能）
CREATE POLICY "Users can read all history" ON history FOR SELECT USING (true);
CREATE POLICY "Users can insert history" ON history FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update history" ON history FOR UPDATE USING (true);

-- インデックスを作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_keywords_user_id ON keywords(user_id);
CREATE INDEX IF NOT EXISTS idx_keywords_created_at ON keywords(created_at);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);