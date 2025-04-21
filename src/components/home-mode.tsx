'use client'

import { useEffect, useState } from "react"


export function HomeMode() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const hours = currentTime.getHours().toString().padStart(2, '0')
  const minutes = currentTime.getMinutes().toString().padStart(2, '0')
  // const seconds = currentTime.getSeconds().toString().padStart(2, '0')

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="text-center">
        <span className="text-9xl font-light tracking-wider ">
          {hours}:{minutes}
        </span>
      </div>
    </div>
  )
} 