"use client";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUserStore();
  const router = useRouter();
  return (
    <div className="w-full h-screen px-4 bg-[#f8f6fc]">
      <div className="w-full h-auto flex flex-col justify-center items-center pt-16">
        <div className="group mb-5 rounded-md border border-black/5 bg-[#f3f4f7] text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span className="text-xs uppercase">✨ TaskFlow VERSION 1.0</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
        <h1 className="md:w-[60%] text-5xl md:text-7xl font-bold text-black text-center">
          Focus on what matters, without the stress.
        </h1>
        <p className="md:w-[50%] text-sm text-muted-foreground text-center mt-5">
          Keep all your tasks, deadlines, and priorities in one place. Organize
          your day effortlessly and spend more time on what truly matters.
        </p>
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() =>
              user ? router.push("/dashbaord") : router.push("/login")
            }
            variant="default"
            className="text-xs bg-[#f87941] flex justify-center items-center gap-1"
          >
            START MANAGING <ArrowRight />
          </Button>
          <Button
            onClick={() => router.push("/register")}
            variant="outline"
            className="text-xs"
          >
            LEARN MORE
          </Button>
        </div>
      </div>
    </div>
  );
}
