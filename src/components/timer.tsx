'use client'

import { useTimer } from '@/hooks/use-timer'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatTime } from '@/lib/utils'

export function Timer() {
  const {
    mode,
    isRunning,
    timeLeft,
    settings,
    setMode,
    toggleTimer,
    resetTimer,
  } = useTimer()

  const handleModeChange = (value: string) => {
    setMode(value as 'pomodoro' | 'shortBreak' | 'longBreak')
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <Tabs
        value={mode}
        onValueChange={handleModeChange}
        className="w-full max-w-md"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
          <TabsTrigger value="longBreak">Long Break</TabsTrigger>
        </TabsList>
        <TabsContent value="pomodoro" className="mt-4">
          <div className="text-center">
            <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
            <div className="space-x-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="min-w-[120px]"
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={resetTimer}
                className="min-w-[120px]"
              >
                Reset
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="shortBreak" className="mt-4">
          <div className="text-center">
            <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
            <div className="space-x-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="min-w-[120px]"
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={resetTimer}
                className="min-w-[120px]"
              >
                Reset
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="longBreak" className="mt-4">
          <div className="text-center">
            <div className="text-6xl font-bold mb-8">{formatTime(timeLeft)}</div>
            <div className="space-x-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="min-w-[120px]"
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={resetTimer}
                className="min-w-[120px]"
              >
                Reset
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 