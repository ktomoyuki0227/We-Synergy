import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // サーバーサイド用のSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // グローバルキーワードプールから取得
    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100) // 最新100件から抽選

    if (keywordsError) {
      console.error('キーワード取得エラー:', keywordsError)
      return NextResponse.json(
        { error: 'キーワードの取得に失敗しました' },
        { status: 500 }
      )
    }

    if (!keywords || keywords.length < 2) {
      return NextResponse.json(
        { error: 'キーワードが2つ以上必要です' },
        { status: 400 }
      )
    }

    // ランダムに2つを選出
    const shuffled = [...keywords].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 2)
    
    const result = {
      keyword_a: selected[0].word,
      keyword_b: selected[1].word
    }

    // 履歴に保存
    const { error: historyError } = await supabase
      .from('history')
      .insert({
        keyword_a: result.keyword_a,
        keyword_b: result.keyword_b
      })

    if (historyError) {
      console.error('履歴保存エラー:', historyError)
      // エラーでも結果は返す
    }

    return NextResponse.json({ result })

  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
