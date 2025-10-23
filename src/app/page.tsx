"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const [roomName, setRoomName] = useState("")
  const [userName, setUserName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const { setUser, setCurrentRoom } = useAppStore()

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !userName.trim()) return
    
    setIsCreating(true)
    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: roomName.trim(),
          userName: userName.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'ルーム作成に失敗しました')
      }

      const { user, room } = await response.json()
      
      setUser(user)
      setCurrentRoom(room)
      
      // ルームページに遷移
      window.location.href = `/room/${room.id}`
    } catch (error) {
      console.error("ルーム作成エラー:", error)
      alert(error instanceof Error ? error.message : 'ルーム作成に失敗しました')
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!roomId.trim() || !userName.trim()) return
    
    setIsJoining(true)
    try {
      const response = await fetch('/api/join-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId.trim(),
          userName: userName.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'ルーム参加に失敗しました')
      }

      const { user, room } = await response.json()
      
      setUser(user)
      setCurrentRoom(room)
      
      // ルームページに遷移
      window.location.href = `/room/${room.id}`
    } catch (error) {
      console.error("ルーム参加エラー:", error)
      alert(error instanceof Error ? error.message : 'ルーム参加に失敗しました')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            We = Synergy
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            キーワードの組み合わせから新しいアイデアを生み出す
            <br />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">チームビルディング・アイスブレイクアプリ</span>
          </motion.p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* ルーム作成 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">新しいルームを作成</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  新しいセッションを開始して、チームメンバーを招待しましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">ルーム名</label>
                  <Input
                    placeholder="例: チームAlpha"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">あなたの名前</label>
                  <Input
                    placeholder="例: 田中太郎"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <Button 
                  onClick={handleCreateRoom}
                  disabled={isCreating || !roomName.trim() || !userName.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isCreating ? "作成中..." : "✨ ルームを作成"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ルーム参加 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="h-full shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">既存のルームに参加</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-base">
                  ルームIDを入力して、既存のセッションに参加しましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">ルームID</label>
                  <Input
                    placeholder="例: abc123-def456"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">あなたの名前</label>
                  <Input
                    placeholder="例: 田中太郎"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
                <Button 
                  onClick={handleJoinRoom}
                  disabled={isJoining || !roomId.trim() || !userName.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                  variant="outline"
                >
                  {isJoining ? "参加中..." : "🎯 ルームに参加"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 特徴説明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12">
            アプリの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">創造的発想</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                ランダムなキーワードの組み合わせから、新しいアイデアを発見
              </p>
            </motion.div>
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">チームビルディング</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                リアルタイムで共有し、チームの結束を深める
              </p>
            </motion.div>
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">リアルタイム</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                オンライン・対面問わず、即座に結果を共有
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
