import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from- emerald-50 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-2xl border border-emerald-100">
        <div className="text-6xl mb-6">🌾</div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Smart Crop Disaster Managers
          <span className="block text-emerald-600">Plan. Simulate. Survive.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Visualize flood impacts on your field in 3D and generate optimized drainage solutions instantly.
          Expert-grade analysis for every farmer.
        </p>

        <Link href="/select-disaster" className="group inline-flex items-center px-10 py-5 text-xl font-bold text-white bg-emerald-600 rounded-full shadow-xl hover:bg-emerald-700 transition-all hover:-translate-y-1">
          Start New Simulation
          <span className="ml-3 group-hover:translate-x-1 transition-transform">➡️</span>
        </Link>

        <p className="mt-6 text-sm text-slate-400 font-medium">Powered by FastAPI, Three.js & AI Logic</p>
      </div>
    </main>
  );
}
