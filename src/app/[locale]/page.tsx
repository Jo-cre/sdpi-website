import { LocaleToggle } from "@/components/localeToggle";
import { ModeToggle } from "@/components/modeToggle";
import { TokenCard } from "@/components/tokenCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <ModeToggle />
        <LocaleToggle />
      </div>
      <TokenCard />
    </div>
  );
}
