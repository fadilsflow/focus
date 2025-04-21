'use client'

import { PomodoroTimer } from "@/components/pomodoro-timer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmbientMode } from "@/components/ambient-mode";
import { HomeMode } from "@/components/home-mode";
import { Focus, Home, Lamp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


export function ModeContainer() {


  return (
    <div className="flex flex-col max-h-screen overflow-hidden py-40 items-center justify-center">

      <Tabs defaultValue="focus" className="w-full max-w-2xl">
        <TabsList className="fixed bottom-4 right-16 z-50 bg-background/80 backdrop-blur-sm rounded-full p-1 flex items-center gap-1 w-fit">
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="focus" 
                className="relative rounded-full p-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                <Focus className="h-4 w-4" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary data-[state=active]:animate-pulse" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              Focus
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="home" 
                className="relative rounded-full p-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary data-[state=active]:animate-pulse" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              Home
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="ambient" 
                className="relative rounded-full p-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                <Lamp className="h-4 w-4" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary data-[state=active]:animate-pulse" />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              Ambient
            </TooltipContent>
          </Tooltip>
        </TabsList>

        <TabsContent value="focus" className="h-full w-full">
          <PomodoroTimer/>
        </TabsContent>
        <TabsContent value="home" className="h-full w-full">
          <HomeMode/>
          {/* {isRunning && <AmbientMode/>} */}
        </TabsContent>
        <TabsContent value="ambient" className="h-full w-full">
          <AmbientMode/>
        </TabsContent>
      </Tabs>
    </div>
  );
} 