// lib/store/timer.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: TimerMode
  isRunning: boolean
  timeLeft: number
  completedPomodoros: number
  totalFocusTime: number // in seconds
  settings: {
    pomodoroTime: number
    shortBreakTime: number
    longBreakTime: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
    longBreakInterval: number
  }
  setMode: (mode: TimerMode) => void
  toggleTimer: () => void
  resetTimer: () => void
  updateSettings: (settings: Partial<TimerState['settings']>) => void
  addFocusTime: (time: number) => void
  incrementCompletedPomodoros: () => void
}

const defaultSettings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'pomodoro',
      isRunning: false,
      timeLeft: defaultSettings.pomodoroTime * 60,
      completedPomodoros: 0,
      totalFocusTime: 0,
      settings: defaultSettings,
      setMode: (mode) => {
        const settings = get().settings
        const newTimeLeft = mode === 'pomodoro' 
          ? settings.pomodoroTime * 60 
          : mode === 'shortBreak' 
            ? settings.shortBreakTime * 60 
            : settings.longBreakTime * 60
        
        set({ mode, timeLeft: newTimeLeft, isRunning: false })
      },
      toggleTimer: () => {
        set((state) => ({ isRunning: !state.isRunning }))
      },
      resetTimer: () => {
        const settings = get().settings
        const mode = get().mode
        const newTimeLeft = mode === 'pomodoro' 
          ? settings.pomodoroTime * 60 
          : mode === 'shortBreak' 
            ? settings.shortBreakTime * 60 
            : settings.longBreakTime * 60
        
        set({ timeLeft: newTimeLeft, isRunning: false })
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
          timeLeft: state.mode === 'pomodoro' 
            ? (newSettings.pomodoroTime || state.settings.pomodoroTime) * 60 || state.timeLeft
            : state.mode === 'shortBreak'
              ? (newSettings.shortBreakTime || state.settings.shortBreakTime) * 60 || state.timeLeft
              : (newSettings.longBreakTime || state.settings.longBreakTime) * 60 || state.timeLeft
        }))
      },
      addFocusTime: (time) => {
        set((state) => ({ totalFocusTime: state.totalFocusTime + time }))
      },
      incrementCompletedPomodoros: () => {
        set((state) => ({ completedPomodoros: state.completedPomodoros + 1 }))
      },
    }),
    {
      name: 'timer-storage',
    }
  )
) 