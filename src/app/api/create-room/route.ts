import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { roomName, userName } = await request.json()
    
    if (!roomName || !userName) {
      return NextResponse.json(
        { error: 'ルーム名とユーザー名が必要です' },
        { status: 400 }
      )
    }

    // サーバーサイド用のSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
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

    // ルームを作成
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({ 
        name: roomName, 
        host_id: user.id 
      })
      .select()
      .single()

    if (roomError) {
      console.error('ルーム作成エラー:', roomError)
      return NextResponse.json(
        { error: 'ルーム作成に失敗しました' },
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
