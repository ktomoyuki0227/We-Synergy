import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const { roomId } = await request.json()
    
    if (!roomId) {
      return NextResponse.json(
        { error: 'ルームIDが必要です' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    // ルーム内のキーワードを取得
    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('*')
      .eq('room_id', roomId)

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
        room_id: roomId,
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
