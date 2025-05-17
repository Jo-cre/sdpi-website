"use client";
import { LocaleToggle } from "@/components/localeToggle";
import { ModeToggle } from "@/components/modeToggle";
import { TokenCard } from "@/components/tokenCard";
import { TokenForm } from "@/components/tokenForm";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  console.log("Mobile:", isMobile);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <ModeToggle />
        <LocaleToggle />
      </div>
      {isMobile ? <TokenForm /> : <TokenCard />}
    </div>
  );
}
