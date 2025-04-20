import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { FullscreenContainer } from "@/components/fullscreen-container";


export default function Home() {
  return (
    <FullscreenContainer>
      <Navbar />
      <div className="flex no-scrollbar flex-col min-h-screen items-center justify-center">
        <PomodoroTimer/>
      </div>
      {/* <BottomBar /> */}
      <Footer />
    </FullscreenContainer>
  );
}
