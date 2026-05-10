// app/not-found.tsx
import Link from "next/link";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <Terminal className="w-16 h-16 text-matrix mx-auto animate-pulse" />
        <h1 className="font-serif text-4xl font-bold">
          404 <span className="text-matrix">// EDICIÓN NO ENCONTRADA</span>
        </h1>
        <p className="font-mono text-gray-400">
          El hackathon solicitado no existe o está en borrador.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 border border-matrix text-matrix font-mono rounded hover:bg-matrix/10 transition-all"
        >
          ← VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}