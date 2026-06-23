import { Suspense } from "react";
import BooksClient from "./BooksClient";

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/40 border border-white/5 rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <BooksClient />
    </Suspense>
  );
}
