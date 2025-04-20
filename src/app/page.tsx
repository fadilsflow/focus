import Navbar from "@/components/navbar";
import { FullscreenContainer } from "@/components/fullscreen-container";
import { ModeContainer } from "@/components/mode-container";

export default function Home() {
  return (
    <FullscreenContainer>
      <Navbar />
      <ModeContainer />
    </FullscreenContainer>
  );
}
