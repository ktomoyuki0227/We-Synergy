import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { userId, word } = await request.json()
    
    if (!userId || !word) {
      return NextResponse.json(
        { error: 'ユーザーIDとキーワードが必要です' },
        { status: 400 }
      )
    }

    // サーバーサイド用のSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // キーワードを保存（グローバルプール）
    const { data: keyword, error } = await supabase
      .from('keywords')
      .insert({ 
        user_id: userId,
        word: word.trim()
      })
      .select()
      .single()

    if (error) {
      console.error('キーワード保存エラー:', error)
      return NextResponse.json(
        { error: 'キーワードの保存に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ keyword })

  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
