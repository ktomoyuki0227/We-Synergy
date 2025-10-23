import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { roomId, userName } = await request.json()
    
    if (!roomId || !userName) {
      return NextResponse.json(
        { error: 'ルームIDとユーザー名が必要です' },
        { status: 400 }
      )
    }

    // サーバーサイド用のSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // ルームの存在確認
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      console.error('ルーム検索エラー:', roomError)
      return NextResponse.json(
        { error: 'ルームが見つかりません' },
        { status: 404 }
      )
    }

    // ユーザーを作成
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({ name: userName })
      .select()
      .single()

    if (userError) {
      console.error('ユーザー作成エラー:', userError)
      return NextResponse.json(
        { error: 'ユーザー作成に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user,
      room
    })

  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
