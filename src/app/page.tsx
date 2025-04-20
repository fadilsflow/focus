import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PomodoroTimer } from "@/components/pomodoro-timer";


export default function Home() {
  return (
    <main >
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <PomodoroTimer/>
      </div>
      <Footer />
    </main>
  );
}
