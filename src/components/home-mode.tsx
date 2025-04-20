'use client'

import { useTimerStore } from "@/lib/store/timer"
import { formatTime } from "@/lib/utils"

export function HomeMode() {
  const { timeLeft } = useTimerStore()

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <span className="text-7xl font-light tracking-wider text-muted-foreground">{formatTime(timeLeft)}</span>
      </div>
    </div>
  )
} 