// src/components/pomodoro-timer.tsx


import { useEffect, useRef } from "react"
import { SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTimerStore } from "@/lib/store/timer"
import { toast } from "sonner"
import { formatTime } from "@/lib/utils"
import type { TimerMode } from "@/lib/store/timer"
import { createClient } from "@/lib/supabase/client"

export function PomodoroTimer() {
  const { mode, isRunning, timeLeft, setMode, toggleTimer, settings, completedPomodoros, incrementCompletedPomodoros } = useTimerStore()
  const hasSentFocusTime = useRef(false)
  
  const handleSkip = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userid = user?.id
    if (!userid) {
      toast.error("Please login to save your focus time")
      return
    } else {
      // Track focus time when skipping pomodoro
      if (mode === "pomodoro") {
        const initialTime = settings.pomodoroTime * 60
      const focusTime = initialTime - timeLeft
      // Send focus time, but don't wait for it
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusTime }),
      }).catch(console.error) // Log error if fetch fails
      }
    }

    // Determine next mode
    let nextMode: TimerMode = "pomodoro" // Default if skipping a break
    if (mode === "pomodoro") {
      // Increment first, then check
      incrementCompletedPomodoros()
      const currentCompleted = useTimerStore.getState().completedPomodoros // Get updated count
      const shouldTakeLongBreak = currentCompleted > 0 && settings.longBreakInterval > 0 && currentCompleted % settings.longBreakInterval === 0
      nextMode = shouldTakeLongBreak ? "longBreak" : "shortBreak"
    }

    await setMode(nextMode)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    const handleTimerEnd = async () => {
      useTimerStore.setState({ isRunning: false })

      let nextModeDetermined: TimerMode | null = null;

      // Determine next mode when pomodoro ends
      if (mode === "pomodoro") {
        incrementCompletedPomodoros() // Increment first
        const currentCompleted = useTimerStore.getState().completedPomodoros // Get updated count
        const shouldTakeLongBreak = currentCompleted > 0 && settings.longBreakInterval > 0 && currentCompleted % settings.longBreakInterval === 0
        nextModeDetermined = shouldTakeLongBreak ? "longBreak" : "shortBreak";
      } else { // Break ended
        nextModeDetermined = "pomodoro"
        hasSentFocusTime.current = false // Reset the flag for the next pomodoro
      }

      // Show notification when timer ends
      const message = mode === "pomodoro" 
        ? "Pomodoro completed! Take a break." 
        : "Break time is over! Back to work."
      toast.success(message)

      // Auto start next timer based on settings or just set the mode
      const shouldAutoStart = (mode === "pomodoro" && settings.autoStartBreaks) ||
                              ((mode === "shortBreak" || mode === "longBreak") && settings.autoStartPomodoros);

      if (nextModeDetermined) {
        await setMode(nextModeDetermined)
        if (shouldAutoStart) {
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
  }, [isRunning, timeLeft, mode, settings, setMode, completedPomodoros, incrementCompletedPomodoros, toggleTimer])

  // Separate effect for tracking focus time
  useEffect(() => {
    if (mode === "pomodoro" && timeLeft === 0 && !hasSentFocusTime.current) {
      const initialTime = settings.pomodoroTime * 60
      const focusTime = initialTime
      
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusTime }),
      }).catch(console.error)
      
      hasSentFocusTime.current = true
    } else if (mode !== "pomodoro") {
      hasSentFocusTime.current = false
    }
  }, [mode, timeLeft, settings.pomodoroTime])

  return (
    <div className="flex flex-col items-center justify-center mx-auto min-h-screen">
      <div>
        <Tabs

          defaultValue="pomodoro"
          value={mode}
          // Prevent changing mode while timer is running to avoid complications
          onValueChange={async (value) => {
             if (!isRunning) {
               await setMode(value as TimerMode)
             } else {
               toast.warning("Please pause the timer before switching modes.")
             }
          }}
          className="mb-6"
        >
          {/* tabs list */}
          <TabsList className="grid grid-cols-3 w-fit mx-auto bg-transparent">
            <TabsTrigger value="pomodoro" disabled={isRunning && mode !== 'pomodoro'} className="rounded-full">Pomodoros</TabsTrigger>
            <TabsTrigger value="shortBreak" disabled={isRunning && mode !== 'shortBreak'} className="rounded-full">Short Break</TabsTrigger>
            <TabsTrigger value="longBreak" disabled={isRunning && mode !== 'longBreak'} className="rounded-full">Long Break</TabsTrigger>
          </TabsList>
          <TabsContent value="pomodoro" className="mt-0"></TabsContent>
          <TabsContent value="shortBreak" className="mt-0"></TabsContent>
          <TabsContent value="longBreak" className="mt-0"></TabsContent>
        </Tabs>

        {/* timer */}
        <div className="text-center mb-8 ">
          <span className="text-9xl font-sans font-light">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex justify-center space-x-4">
          <div className="relative">
            <Button size="lg" onClick={toggleTimer} className="rounded-full text-lg font-bold w-30 htransition-colors duration-200 ease-in-out">
              {isRunning ? "Pause" : "Start"}
            </Button>
            {isRunning && (
              <Button 
                variant="secondary" 
                size="icon" 
                onClick={handleSkip}
                className="absolute -right-12 top-1/2 -translate-y-1/2 rounded-full"
              >
                <SkipForward className="h-5 w-5 " />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}