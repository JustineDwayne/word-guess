'use client';
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Home() {

  const router = useRouter();

  const startButton = () => {
    router.push("/game");
  }

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Home</h1>
      <h2>starting</h2>

      <Button 
        label="Start" 
        onClick={startButton} 
        bgColor="bg-white"
        textColor="text-black"
        className="border-black rounded-lg border-2 font-extrabold hover:cursor-pointer hover:bg-amber-100"/>
    </main>

  );
}
