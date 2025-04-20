"use client"

import { useEffect, useState } from 'react'
import { useTimerStore } from '@/lib/store/timer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,   
  CardTitle,    
} from '@/components/ui/card'
import { toast } from "sonner"
import { createClient } from '@/lib/supabase/client'

export function TimerSettings() {
  const { settings, updateSettings } = useTimerStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()
  }, [])

  const handleTimeChange = (field: keyof typeof settings, value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      updateSettings({ [field]: numValue })
    }
  }

  const handleSwitchChange = (field: keyof typeof settings, value: boolean) => {
    updateSettings({ [field]: value })
  }

  const handleSave = async () => {
    setIsLoading(true)
    const toastId = toast.loading('Saving settings...')

    try {
      // Always update local state first
      updateSettings(settings)
      
      if (isLoggedIn) {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 503) {
            toast.error('Database connection error', {
              id: toastId,
              description: 'Your settings have been saved locally. Please try again later.',
            })
            return
          }
          throw new Error(data.error || 'Failed to save settings')
        }

        toast.success('Settings saved successfully', {
          id: toastId,
          description: 'Your settings have been synced to the cloud',
        })
      } else {
        toast.success('Settings saved locally', {
          id: toastId,
          description: 'Sign in to sync your settings across devices',
        })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('Database connection error')) {
          toast.error('Database connection error', {
            id: toastId,
            description: 'Your settings have been saved locally. Please try again later.',
          })
        } else {
          toast.error('Failed to save settings', {
            id: toastId,
            description: error.message,
          })
        }
      } else {
        toast.error('Failed to save settings', {
          id: toastId,
          description: 'An unexpected error occurred',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pomodoro">Pomodoro Time</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pomodoro"
                  type="number"
                  min="1"
                  value={settings.pomodoroTime}
                  onChange={(e) => handleTimeChange('pomodoroTime', e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBreak">Short Break</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="shortBreak"
                  type="number"
                  min="1"
                  value={settings.shortBreakTime}
                  onChange={(e) => handleTimeChange('shortBreakTime', e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreak">Long Break</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="longBreak"
                  type="number"
                  min="1"
                  value={settings.longBreakTime}
                  onChange={(e) => handleTimeChange('longBreakTime', e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreakInterval">Long Break Interval</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="longBreakInterval"
                  type="number"
                  min="1"
                  value={settings.longBreakInterval}
                  onChange={(e) => handleTimeChange('longBreakInterval', e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">pomodoros</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoStartBreaks">Auto Start Breaks</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start break timers
              </p>
            </div>
            <Switch
              id="autoStartBreaks"
              checked={settings.autoStartBreaks}
              onCheckedChange={(checked) => handleSwitchChange('autoStartBreaks', checked)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoStartPomodoros">Auto Start Pomodoros</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start pomodoro timers
              </p>
            </div>
            <Switch
              id="autoStartPomodoros"
              checked={settings.autoStartPomodoros}
              onCheckedChange={(checked) => handleSwitchChange('autoStartPomodoros', checked)}
            />
          </div>
        </div>
      </div>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </div>
  )
}