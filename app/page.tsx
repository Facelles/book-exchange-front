"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const router = useRouter();
  const { token, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (token) {
      router.push("/books");
    } else {
      router.push("/register");
    }
  }, [isInitialized, token, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}
