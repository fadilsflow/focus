import { useEffect, useCallback } from 'react'
import { useTimerStore } from '@/lib/store/timer'

export function useTimer() {
  const {
    mode,
    isRunning,
    timeLeft,
    settings,
    setMode,
    toggleTimer,
    resetTimer,
    updateSettings,
    addFocusTime,
    incrementCompletedPomodoros,
  } = useTimerStore()

  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            updateSettings(data)
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }

    loadSettings()
  }, [updateSettings])

  // Save settings to database
  const saveSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }, [settings])

  // Save focus time to database
  const saveFocusTime = useCallback(async (focusTime: number) => {
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ focusTime }),
      })

      if (!response.ok) {
        throw new Error('Failed to save focus time')
      }
    } catch (error) {
      console.error('Error saving focus time:', error)
    }
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    let startTime: number | null = null

    if (isRunning && timeLeft > 0 && mode === 'pomodoro') {
      startTime = Date.now()
      interval = setInterval(() => {
        useTimerStore.setState((state) => ({
          timeLeft: state.timeLeft - 1,
        }))
      }, 1000)
    } else if (timeLeft === 0 && mode === 'pomodoro') {
      // Timer completed
      const focusTime = settings.pomodoroTime * 60 // Convert minutes to seconds
      saveFocusTime(focusTime)
      addFocusTime(focusTime)
      incrementCompletedPomodoros()

      // Handle auto-start settings
      if (settings.autoStartBreaks) {
        // Check if it's time for a long break
        const currentPomodoroCount = useTimerStore.getState().completedPomodoros
        const nextMode = (currentPomodoroCount + 1) % settings.longBreakInterval === 0 
          ? 'longBreak' 
          : 'shortBreak'
        setMode(nextMode)
      }
    }

    return () => {
      clearInterval(interval)
      // If timer was running and we're in pomodoro mode, save the focus time
      if (startTime && mode === 'pomodoro') {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000)
        if (elapsedTime > 0) {
          saveFocusTime(elapsedTime)
          addFocusTime(elapsedTime)
        }
      }
    }
  }, [isRunning, timeLeft, mode, settings, setMode, saveFocusTime, addFocusTime, incrementCompletedPomodoros])

  // Handle mode change
  const handleModeChange = useCallback(async (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    // If changing from pomodoro mode, save the focus time
    if (mode === 'pomodoro') {
      const elapsedTime = Math.floor((settings.pomodoroTime * 60 - timeLeft))
      if (elapsedTime > 0) {
        await saveFocusTime(elapsedTime)
        addFocusTime(elapsedTime)
        incrementCompletedPomodoros() // Increment when skipped
      }
    }

    // Check if it's time for a long break
    const currentPomodoroCount = useTimerStore.getState().completedPomodoros
    const shouldTakeLongBreak = (currentPomodoroCount + 1) % settings.longBreakInterval === 0

    // If going to break and it's time for long break, force long break
    if (newMode === 'shortBreak' && shouldTakeLongBreak) {
      setMode('longBreak')
    } else {
      setMode(newMode)
    }

    // Reset timer for the new mode
    useTimerStore.setState((state) => ({
      timeLeft: newMode === 'pomodoro' 
        ? state.settings.pomodoroTime * 60 
        : newMode === 'shortBreak' 
          ? state.settings.shortBreakTime * 60 
          : state.settings.longBreakTime * 60
    }))
  }, [mode, settings.pomodoroTime, timeLeft, setMode, saveFocusTime, addFocusTime, incrementCompletedPomodoros, settings.longBreakInterval])

  return {
    mode,
    isRunning,
    timeLeft,
    settings,
    setMode: handleModeChange,
    toggleTimer,
    resetTimer,
    updateSettings: (newSettings: Partial<typeof settings>) => {
      updateSettings(newSettings)
      saveSettings()
    },
  }
} 
