'use client'

import { PomodoroTimer } from "@/components/pomodoro-timer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmbientMode } from "@/components/ambient-mode";
import { Timer } from "lucide-react";
import { HomeMode } from "@/components/home-mode";

export function ModeContainer() {
  return (
    <div className="flex flex-col max-h-screen overflow-hidden py-40 items-center justify-center">
      <Tabs defaultValue="focus" className="w-full max-w-2xl">
        <TabsList className="fixed bottom-4 right-16 z-50 bg-background/80 backdrop-blur-sm">
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Focus
          </TabsTrigger>
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Home
          </TabsTrigger>
          <TabsTrigger value="ambient" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Ambient
          </TabsTrigger>
        </TabsList>

        <TabsContent value="focus">
          <PomodoroTimer/>
        </TabsContent>
        <TabsContent value="home">
          <HomeMode/>
        </TabsContent>
        <TabsContent value="ambient">

          <AmbientMode/>
        </TabsContent>
      </Tabs>
    </div>
  );
} 