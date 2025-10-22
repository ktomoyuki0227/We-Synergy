import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const { roomId, userId, word } = await request.json()
    
    if (!roomId || !userId || !word) {
      return NextResponse.json(
        { error: 'ルームID、ユーザーID、キーワードが必要です' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    // キーワードを保存
    const { data: keyword, error } = await supabase
      .from('keywords')
      .insert({ 
        room_id: roomId,
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
