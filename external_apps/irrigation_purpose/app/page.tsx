'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sprout, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-50 to-green-100 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 p-4 bg-green-100 rounded-full inline-block"
      >
        <Sprout size={64} className="text-green-600" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold text-green-900 tracking-tight"
      >
        Smart Irrigation <br />
        <span className="text-green-600">Layout Simulator</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-6 text-xl text-green-700 max-w-2xl mx-auto"
      >
        Design your agricultural field, simulate sprinkler coverage, and maximize your yield with our 3D visualization tool.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-10"
      >
        <Link href="/select-irrigation">
          <button className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
            Start Designing
            <ArrowRight size={24} />
          </button>
        </Link>
      </motion.div>

      <footer className="absolute bottom-6 text-green-800/60 text-sm">
        © 2025 Smart Irrigation System. Designed for Farmers.
      </footer>
    </main>
  );
}
