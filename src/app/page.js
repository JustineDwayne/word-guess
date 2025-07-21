'use client';
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();

  const startButton = () => {
    router.push("/game");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-300 p-6">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md">
        {/* Title with typing animation */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-md underline typing">
          BROCABULARY
        </h1>

        <div className="w-full text-left">
          <p className="text-lg sm:text-xl text-gray-700 font-medium italic">
            noun /ˈbroʊˌkæbjəˌleri/
          </p>

          <ul className="list-disc pl-6 text-md sm:text-lg text-gray-700 space-y-1">
            <li>A word guessing game</li>
            <li>Learn and expand your vocabulary</li>
            <li>Can you guess them all?</li>
          </ul>
        </div>

        {/* Start Game Button */}
        <Button
          label="Start Game"
          onClick={startButton}
          textColor="text-white"
          bgColor="bg-blue-500"
          className="hover:bg-blue-600"
        />
      </div>
    </main>
  );
}
