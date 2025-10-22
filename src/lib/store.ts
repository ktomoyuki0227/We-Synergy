import { create } from 'zustand'

export interface User {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  host_id: string
}

export interface Keyword {
  id: string
  room_id: string
  user_id: string
  word: string
  created_at: string
}

export interface DrawResult {
  keyword_a: string
  keyword_b: string
}

interface AppState {
  // ユーザー情報
  user: User | null
  setUser: (user: User | null) => void
  
  // ルーム情報
  currentRoom: Room | null
  setCurrentRoom: (room: Room | null) => void
  
  // キーワード一覧
  keywords: Keyword[]
  setKeywords: (keywords: Keyword[]) => void
  addKeyword: (keyword: Keyword) => void
  
  // 抽選結果
  drawResult: DrawResult | null
  setDrawResult: (result: DrawResult | null) => void
  
  // タイマー
  timeLeft: number
  setTimeLeft: (time: number) => void
  
  // 履歴
  history: DrawResult[]
  setHistory: (history: DrawResult[]) => void
  
  // 接続状態
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  
  keywords: [],
  setKeywords: (keywords) => set({ keywords }),
  addKeyword: (keyword) => set((state) => ({ 
    keywords: [...state.keywords, keyword] 
  })),
  
  drawResult: null,
  setDrawResult: (result) => set({ drawResult: result }),
  
  timeLeft: 0,
  setTimeLeft: (time) => set({ timeLeft: time }),
  
  history: [],
  setHistory: (history) => set({ history }),
  
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
}))
