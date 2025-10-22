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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">アクセスエラー</h1>
          <p className="text-gray-600 mb-4">ユーザー情報またはルーム情報が見つかりません</p>
          <Button onClick={() => window.location.href = "/"}>
            ホームに戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {currentRoom.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            ルームID: {roomId} | 参加者: {user.name}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* 左側: キーワード入力・一覧 */}
          <div className="space-y-6">
            {/* キーワード入力 */}
            <Card>
              <CardHeader>
                <CardTitle>キーワードを入力</CardTitle>
                <CardDescription>
                  アイデアのきっかけとなるキーワードを入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="例: AI、おにぎり、宇宙..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitKeyword()}
                />
                <Button 
                  onClick={handleSubmitKeyword}
                  disabled={!keyword.trim()}
                  className="w-full"
                >
                  キーワードを送信
                </Button>
              </CardContent>
            </Card>

            {/* キーワード一覧 */}
            <Card>
              <CardHeader>
                <CardTitle>入力されたキーワード</CardTitle>
                <CardDescription>
                  {keywords.length}個のキーワードが入力されています
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {keywords.map((kw) => (
                    <motion.div
                      key={kw.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg text-center font-medium"
                    >
                      {kw.word}
                    </motion.div>
                  ))}
                </div>
                {keywords.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    まだキーワードが入力されていません
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右側: 抽選・結果表示 */}
          <div className="space-y-6">
            {/* 抽選ボタン */}
            <Card>
              <CardHeader>
                <CardTitle>ランダム抽選</CardTitle>
                <CardDescription>
                  キーワードが2つ以上入力されたら抽選できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDraw}
                  disabled={isDrawing || keywords.length < 2}
                  className="w-full"
                  size="lg"
                >
                  {isDrawing ? "抽選中..." : "キーワードを抽選"}
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
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl">抽選結果</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {drawResult.keyword_a}
                      </div>
                      <div className="text-2xl text-gray-400">×</div>
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                        {drawResult.keyword_b}
                      </div>
                    </div>
                    
                    {/* タイマー */}
                    {timeLeft > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg"
                      >
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                          発想時間
                        </p>
                        <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
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
                className="flex-1"
              >
                ホームに戻る
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                ページを更新
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
