import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // サーバーサイド用のSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // 履歴を取得
    const { data: history, error } = await supabase
      .from('history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('履歴取得エラー:', error)
      return NextResponse.json(
        { error: '履歴の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ history })

  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
