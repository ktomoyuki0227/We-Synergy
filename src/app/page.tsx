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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            We = Synergy
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            キーワードの組み合わせから新しいアイデアを生み出す
            <br />
            チームビルディング・アイスブレイクアプリ
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* ルーム作成 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-center">新しいルームを作成</CardTitle>
                <CardDescription className="text-center">
                  新しいセッションを開始して、チームメンバーを招待しましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ルーム名</label>
                  <Input
                    placeholder="例: チームAlpha"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">あなたの名前</label>
                  <Input
                    placeholder="例: 田中太郎"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateRoom}
                  disabled={isCreating || !roomName.trim() || !userName.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isCreating ? "作成中..." : "ルームを作成"}
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
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-center">既存のルームに参加</CardTitle>
                <CardDescription className="text-center">
                  ルームIDを入力して、既存のセッションに参加しましょう
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ルームID</label>
                  <Input
                    placeholder="例: abc123-def456"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">あなたの名前</label>
                  <Input
                    placeholder="例: 田中太郎"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleJoinRoom}
                  disabled={isJoining || !roomId.trim() || !userName.trim()}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  {isJoining ? "参加中..." : "ルームに参加"}
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
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            アプリの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">創造的発想</h3>
              <p className="text-gray-600 dark:text-gray-300">
                ランダムなキーワードの組み合わせから、新しいアイデアを発見
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">チームビルディング</h3>
              <p className="text-gray-600 dark:text-gray-300">
                リアルタイムで共有し、チームの結束を深める
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">リアルタイム</h3>
              <p className="text-gray-600 dark:text-gray-300">
                オンライン・対面問わず、即座に結果を共有
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
