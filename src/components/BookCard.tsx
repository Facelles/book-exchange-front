"use client";

import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";
import { User, BookOpen } from "lucide-react";
import { useState } from "react";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className="relative bg-slate-800/60 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-52 bg-slate-700/50 overflow-hidden">
          {book.photoUrl && book.photoUrl.startsWith("http") && !imgError ? (
            <Image
              src={book.photoUrl}
              alt={book.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center mb-2 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <BookOpen size={24} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                No Cover
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-base leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {book.name}
          </h3>
          <p className="mt-1 text-sm text-slate-400 italic line-clamp-1">
            {book.author}
          </p>

          {book.owner && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <User size={12} />
              <span className="truncate">{book.owner.email}</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
    </Link>
  );
}
