import { ModeToggle } from "@/components/modeToggle";
import { TokenCard } from "@/components/tokenCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute bottom-4 left-4">
        <ModeToggle />
      </div>
      <TokenCard />
    </div>
  );
}
