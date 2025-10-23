"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export default function RoomPage() {
  const params = useParams()
  const roomId = params.id as string
  
  const [keyword, setKeyword] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const [timer, setTimer] = useState(0)
  
  const { 
    user, 
    currentRoom, 
    keywords, 
    drawResult, 
    timeLeft,
    setKeywords,
    addKeyword,
    setDrawResult,
    setTimeLeft
  } = useAppStore()

  // タイマー効果
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timeLeft, setTimeLeft])

  const handleSubmitKeyword = async () => {
    if (!keyword.trim() || !user) return
    
    try {
      const response = await fetch('/api/submit-keyword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
          userId: user.id,
          word: keyword.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'キーワードの送信に失敗しました')
      }

      const { keyword: newKeyword } = await response.json()
      addKeyword(newKeyword)
      setKeyword("")
    } catch (error) {
      console.error("キーワード送信エラー:", error)
      alert(error instanceof Error ? error.message : 'キーワードの送信に失敗しました')
    }
  }

  const handleDraw = async () => {
    if (keywords.length < 2) return
    
    setIsDrawing(true)
    try {
      const response = await fetch('/api/draw-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '抽選に失敗しました')
      }

      const { result } = await response.json()
      setDrawResult(result)
      setTimeLeft(300) // 5分のタイマー開始
    } catch (error) {
      console.error("抽選エラー:", error)
      alert(error instanceof Error ? error.message : '抽選に失敗しました')
    } finally {
      setIsDrawing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!user || !currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">アクセスエラー</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
              ユーザー情報またはルーム情報が見つかりません
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.href = "/"}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🏠 ホームに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {currentRoom.name}
          </h1>
          <div className="flex items-center justify-center gap-4 text-slate-600 dark:text-slate-300">
            <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-sm font-medium">
              🏠 ルームID: {roomId}
            </span>
            <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-sm font-medium">
              👤 {user.name}
            </span>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* 左側: キーワード入力・一覧 */}
          <div className="space-y-8">
            {/* キーワード入力 */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">キーワードを入力</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  アイデアのきっかけとなるキーワードを入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  placeholder="例: AI、おにぎり、宇宙..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitKeyword()}
                  className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
                />
                <Button 
                  onClick={handleSubmitKeyword}
                  disabled={!keyword.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✨ キーワードを送信
                </Button>
              </CardContent>
            </Card>

            {/* キーワード一覧 */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">入力されたキーワード</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{keywords.length}個</span>のキーワードが入力されています
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {keywords.map((kw) => (
                    <motion.div
                      key={kw.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-xl text-center font-semibold shadow-md hover:shadow-lg transition-shadow"
                    >
                      {kw.word}
                    </motion.div>
                  ))}
                </div>
                {keywords.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-slate-400">📝</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      まだキーワードが入力されていません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右側: 抽選・結果表示 */}
          <div className="space-y-8">
            {/* 抽選ボタン */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎲</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">ランダム抽選</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  キーワードが<span className="text-orange-600 dark:text-orange-400 font-semibold">2つ以上</span>入力されたら抽選できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDraw}
                  disabled={isDrawing || keywords.length < 2}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isDrawing ? "🎲 抽選中..." : "🎲 キーワードを抽選"}
                </Button>
              </CardContent>
            </Card>

            {/* 抽選結果 */}
            {drawResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">抽選結果</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-6">
                      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {drawResult.keyword_a}
                      </div>
                      <div className="text-3xl text-slate-400 font-bold">×</div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {drawResult.keyword_b}
                      </div>
                    </div>
                    
                    {/* タイマー */}
                    {timeLeft > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-2xl shadow-lg"
                      >
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3 font-semibold">
                          ⏰ 発想時間
                        </p>
                        <p className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
                          {formatTime(timeLeft)}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* アクションボタン */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/"}
                className="flex-1 h-12 text-base font-semibold border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                🏠 ホームに戻る
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🔄 ページを更新
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
