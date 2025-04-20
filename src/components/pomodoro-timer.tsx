// src/components/pomodoro-timer.tsx
"use client"

import { useEffect } from "react"
import { Play, Pause, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTimerStore } from "@/lib/store/timer"
import { toast } from "sonner"
import { formatTime } from "@/lib/utils"

export function PomodoroTimer() {
  const { 
    mode, 
    isRunning, 
    timeLeft, 
    setMode, 
    toggleTimer, 
    settings, 
    completedPomodoros, 
    incrementCompletedPomodoros,
    addFocusTime 
  } = useTimerStore()

  // Function to determine the next break type based on completed pomodoros
  const determineNextBreakType = () => {
    const isLongBreakDue = (completedPomodoros + 1) % settings.longBreakInterval === 0
    return isLongBreakDue ? "longBreak" : "shortBreak"
  }

  // Function to track focus time
  const trackFocusTime = async (seconds: number) => {
    try {
      // Update local state first
      addFocusTime(seconds)
      
      // Then update the database
      await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusTime: seconds }),
      })
    } catch (error) {
      console.error("Failed to save focus time:", error)
      toast.error("Failed to save your progress")
    }
  }

  const handleSkip = async () => {
    // Track focus time when skipping pomodoro
    if (mode === "pomodoro" && timeLeft < settings.pomodoroTime * 60) {
      const initialTime = settings.pomodoroTime * 60
      const focusTime = initialTime - timeLeft
      
      // Only track if actual focus time occurred
      if (focusTime > 0) {
        await trackFocusTime(focusTime)
      }
      
      // Increment completed pomodoros when skipping a pomodoro session
      incrementCompletedPomodoros()
    }

    // Determine next mode
    let nextMode: "pomodoro" | "shortBreak" | "longBreak"
    
    if (mode === "pomodoro") {
      nextMode = determineNextBreakType()
    } else {
      nextMode = "pomodoro"
    }

    await setMode(nextMode)
    toast.success(`Switched to ${nextMode === "pomodoro" ? "Focus Time" : nextMode === "shortBreak" ? "Short Break" : "Long Break"}`)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    const handleTimerEnd = async () => {
      useTimerStore.setState({ isRunning: false })

      // Track focus time when pomodoro ends
      if (mode === "pomodoro") {
        const initialTime = settings.pomodoroTime * 60
        await trackFocusTime(initialTime)
        incrementCompletedPomodoros()
        
        // Show notification when pomodoro ends
        toast.success("Pomodoro completed! Take a break.")
        
        // Auto start next break timer based on settings
        if (settings.autoStartBreaks) {
          const nextBreakMode = determineNextBreakType()
          await setMode(nextBreakMode)
          useTimerStore.setState({ isRunning: true })
        }
      } else {
        // Show notification when break ends
        toast.success("Break time is over! Back to work.")
        
        // Auto start next pomodoro timer based on settings
        if (settings.autoStartPomodoros) {
          await setMode("pomodoro")
          useTimerStore.setState({ isRunning: true })
        }
      }
    }

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        useTimerStore.setState((state) => ({ 
          timeLeft: state.timeLeft - 1 
        }))
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      handleTimerEnd()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, mode, settings, setMode, completedPomodoros])

  return (
    <div className="shadow-lg">
      <div>
        <Tabs
          defaultValue="pomodoro"
          value={mode}
          onValueChange={async (value) => await setMode(value as "pomodoro" | "shortBreak" | "longBreak")}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak">Long Break</TabsTrigger>
          </TabsList>
          <TabsContent value="pomodoro" className="mt-0"></TabsContent>
          <TabsContent value="shortBreak" className="mt-0"></TabsContent>
          <TabsContent value="longBreak" className="mt-0"></TabsContent>
        </Tabs>

        <div className="text-center mb-8">
          <span className="text-7xl font-bold">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleSkip}>
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button size="lg" onClick={toggleTimer}>
            {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  )
}