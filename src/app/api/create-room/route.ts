import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
  try {
    const { roomName, userName } = await request.json()
    
    if (!roomName || !userName) {
      return NextResponse.json(
        { error: 'ルーム名とユーザー名が必要です' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
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
