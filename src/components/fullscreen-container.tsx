'use client'

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { ReactNode } from "react";
import { Expand, Shrink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullscreenContainerProps {
  children: ReactNode;
}

export function FullscreenContainer({ children }: FullscreenContainerProps) {
  const handle = useFullScreenHandle();

  const toggleFullscreen = async () => {
    if (handle.active) {
      await handle.exit();
    } else {
      await handle.enter();
    }
  };

  return (
    <div className="relative min-h-screen">
      <FullScreen handle={handle}>
        <div className="w-full h-full no-scrollbar overflow-y-scroll">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="fixed bottom-4 right-4 z-50"
          >
            {handle.active ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button>
          {children}
        </div>
      </FullScreen>
    </div>
  );
} 