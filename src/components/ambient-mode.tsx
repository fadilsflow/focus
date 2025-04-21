'use client'

import { useTimerStore } from "@/lib/store/timer"
import { formatTime } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { PomodoroTimer } from "./pomodoro-timer"

export function AmbientMode() {
  const { timeLeft, isRunning, mode, toggleTimer } = useTimerStore()

  const getModeTitle = () => {
    switch (mode) {
      case 'pomodoro':
        return 'Focus Session'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Focus Session'
    }
  }

  return (
    <div className="absolute top-15 border-2 px-2 py-3 rounded-lg right-15 flex flex-col items-center justify-center">
            <div className="hidden">
        <PomodoroTimer />
      </div>

      <div className="w-40 text-center space-y-4">
        <div>
          <h1 className="text-xs ">{getModeTitle()}</h1>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 ">
          <div className="text-5xl font-light tracking-wider ">{formatTime(timeLeft)}</div>
          <div className="flex flex-col items-center justify-center">
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleTimer}
              className="rounded-full"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />

                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />

                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 