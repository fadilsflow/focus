'use client'

import { useTimerStore } from "@/lib/store/timer"
import { formatTime } from "@/lib/utils"

export function AmbientMode() {
  const { timeLeft } = useTimerStore()

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <span className="text-6xl font-light tracking-wider">{formatTime(timeLeft)}</span>
      </div>
    </div>
  )
} 