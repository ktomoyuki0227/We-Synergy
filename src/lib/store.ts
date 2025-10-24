import { create } from 'zustand'
import { supabase } from './supabase'

export interface User {
  id: string
  name: string
  created_at: string
}

export interface Keyword {
  id: string
  user_id: string
  word: string
  created_at: string
}

export interface HistoryItem {
  id: string
  keyword_a: string
  keyword_b: string
  created_at: string
}

interface AppState {
  // ユーザー情報
  user: User | null
  setUser: (user: User | null) => void
  
  // キーワード一覧（グローバルプール）
  keywords: Keyword[]
  setKeywords: (keywords: Keyword[]) => void
  addKeyword: (keyword: Keyword) => void
  
  // 現在選ばれたキーワードペア
  selected: [string, string] | null
  setSelected: (selected: [string, string] | null) => void
  
  // 抽選中フラグ
  isDrawing: boolean
  setIsDrawing: (isDrawing: boolean) => void
  
  // タイマー（残り時間）
  timer: number
  setTimer: (timer: number) => void
  
  // 履歴
  history: HistoryItem[]
  setHistory: (history: HistoryItem[]) => void
  
  // 接続状態
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  
  // リアルタイム接続
  subscribeToKeywords: () => void
  subscribeToHistory: () => void
  unsubscribeAll: () => void
}

// Realtime購読の管理
let keywordsSubscription: any = null
let historySubscription: any = null

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  keywords: [],
  setKeywords: (keywords) => set({ keywords }),
  addKeyword: (keyword) => set((state) => {
    // 重複を防ぐ
    const exists = state.keywords.some(kw => kw.id === keyword.id)
    if (exists) return state
    return { keywords: [...state.keywords, keyword] }
  }),
  
  selected: null,
  setSelected: (selected) => set({ selected }),
  
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  
  timer: 0,
  setTimer: (timer) => set({ timer }),
  
  history: [],
  setHistory: (history) => set({ history }),
  
  isConnected: false,
  setIsConnected: (connected) => set({ isConnected: connected }),
  
  subscribeToKeywords: () => {
    // 既存の購読を解除
    if (keywordsSubscription) {
      keywordsSubscription.unsubscribe()
    }
    
    // キーワードのリアルタイム購読
    keywordsSubscription = supabase
      .channel('keywords-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'keywords' 
        }, 
        (payload) => {
          console.log('新しいキーワードが追加されました:', payload.new)
          const newKeyword = payload.new as Keyword
          set((state) => {
            // 重複を防ぐ
            const exists = state.keywords.some(kw => kw.id === newKeyword.id)
            if (exists) return state
            return { keywords: [...state.keywords, newKeyword] }
          })
        }
      )
      .subscribe((status) => {
        console.log('キーワード購読ステータス:', status)
        set({ isConnected: status === 'SUBSCRIBED' })
      })
  },
  
  subscribeToHistory: () => {
    // 既存の購読を解除
    if (historySubscription) {
      historySubscription.unsubscribe()
    }
    
    // 履歴のリアルタイム購読
    historySubscription = supabase
      .channel('history-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'history' 
        }, 
        (payload) => {
          console.log('新しい履歴が追加されました:', payload.new)
          const newHistoryItem = payload.new as HistoryItem
          set((state) => {
            // 重複を防ぐ
            const exists = state.history.some(item => item.id === newHistoryItem.id)
            if (exists) return state
            return { history: [newHistoryItem, ...state.history] }
          })
        }
      )
      .subscribe((status) => {
        console.log('履歴購読ステータス:', status)
      })
  },
  
  unsubscribeAll: () => {
    if (keywordsSubscription) {
      keywordsSubscription.unsubscribe()
      keywordsSubscription = null
    }
    if (historySubscription) {
      historySubscription.unsubscribe()
      historySubscription = null
    }
    set({ isConnected: false })
  },
}))
