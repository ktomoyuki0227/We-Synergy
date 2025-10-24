"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [userName, setUserName] = useState("")
  const [showNameInput, setShowNameInput] = useState(true)
  
  const { 
    user, 
    keywords, 
    selected, 
    isDrawing, 
    timer,
    history,
    isConnected,
    setUser,
    addKeyword,
    setSelected,
    setIsDrawing,
    setTimer,
    setHistory,
    subscribeToKeywords,
    subscribeToHistory,
    unsubscribeAll
  } = useAppStore()

  // リアルタイム接続を開始
  useEffect(() => {
    if (user) {
      subscribeToKeywords()
      subscribeToHistory()
    }
    
    // クリーンアップ
    return () => {
      unsubscribeAll()
    }
  }, [user, subscribeToKeywords, subscribeToHistory, unsubscribeAll])

  // タイマー効果
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer, setTimer])

  // 履歴を取得
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/get-history')
        if (response.ok) {
          const { history } = await response.json()
          setHistory(history)
        }
      } catch (error) {
        console.error('履歴取得エラー:', error)
      }
    }
    fetchHistory()
  }, [setHistory])

  const handleCreateUser = async () => {
    if (!userName.trim()) return
    
    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName.trim()
        })
      })

      if (!response.ok) {
        throw new Error('ユーザー作成に失敗しました')
      }

      const { user } = await response.json()
      setUser(user)
      setShowNameInput(false)
    } catch (error) {
      console.error("ユーザー作成エラー:", error)
      alert(error instanceof Error ? error.message : 'ユーザー作成に失敗しました')
    }
  }

  const handleSubmitKeyword = async () => {
    if (!keyword.trim() || !user) return
    
    try {
      const response = await fetch('/api/submit-keyword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          word: keyword.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'キーワードの送信に失敗しました')
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
        body: JSON.stringify({})
      })

      if (!response.ok) {
        throw new Error('抽選に失敗しました')
      }

      const { result } = await response.json()
      setSelected([result.keyword_a, result.keyword_b])
      setTimer(300) // 5分のタイマー開始
      
      // 履歴を更新
      const historyResponse = await fetch('/api/get-history')
      if (historyResponse.ok) {
        const { history } = await historyResponse.json()
        setHistory(history)
      }
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

  // ユーザー名入力画面
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">We = Synergy</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
                リアルタイム発想支援アプリへようこそ！
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">ニックネーム（任意）</label>
                <Input
                  placeholder="例: 田中太郎（空白でもOK）"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
                />
              </div>
              <Button 
                onClick={handleCreateUser}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🚀 参加する
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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
            We = Synergy
          </h1>
          <div className="flex items-center justify-center gap-4 text-slate-600 dark:text-slate-300">
            <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-sm font-medium">
              👤 {user?.name || '匿名ユーザー'}
            </span>
            <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full text-sm font-medium">
              📝 {keywords.length}個のキーワード
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {isConnected ? '🟢 接続中' : '🔴 切断中'}
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* メインコンテンツエリア */}
          <div className="flex-1">
          {/* 抽選結果表示 */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-12"
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
                      <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        {selected[0]}
                      </div>
                      <div className="text-4xl text-slate-400 font-bold">×</div>
                      <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        {selected[1]}
                      </div>
                    </div>
                    
                    {/* タイマー */}
                    {timer > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-2xl shadow-lg"
                      >
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3 font-semibold">
                          ⏰ 発想時間
                        </p>
                        <p className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
                          {formatTime(timer)}
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 左側: キーワード入力 */}
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">キーワードを投稿</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                    アイデアのきっかけとなるキーワードを投稿してください
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
                    disabled={!keyword.trim() || !user}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    ✨ キーワードを投稿
                  </Button>
                </CardContent>
              </Card>

              {/* 右側: 抽選ボタン */}
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎲</span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">ランダム抽選</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                    キーワードが<span className="text-orange-600 dark:text-orange-400 font-semibold">2つ以上</span>投稿されたら抽選できます
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
            </div>

            {/* キーワード一覧 */}
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mt-8">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">投稿されたキーワード</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{keywords.length}個</span>のキーワードが投稿されています
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                      まだキーワードが投稿されていません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右側サイドバー: 履歴 */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm sticky top-8">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">抽選履歴</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
                  過去の抽選結果
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 p-3 rounded-lg"
                    >
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                          {item.keyword_a} × {item.keyword_b}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(item.created_at).toLocaleString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {history.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl text-slate-400">📚</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      まだ抽選履歴がありません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
