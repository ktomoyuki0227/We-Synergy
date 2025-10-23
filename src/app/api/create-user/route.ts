import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    
    // サーバーサイド用のSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // 匿名ユーザーを作成
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({ 
        name: name || `ユーザー${Math.random().toString(36).substr(2, 9)}`
      })
      .select()
      .single()

    if (userError) {
      console.error('ユーザー作成エラー:', userError)
      return NextResponse.json(
        { error: 'ユーザー作成に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
