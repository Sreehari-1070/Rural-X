"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  Droplets,
  ThermometerSun,
  Wind,
  Activity,
  CheckCircle2,
  Zap,
  Leaf,
  Settings2,
  TestTube2,
  ArrowRight,
  ChevronDown
} from "lucide-react";

/* ================= TYPES & MAPPINGS ================= */

type FertilizerData = {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
};

// Standard mappings for Fertilizer Recommendation datasets
const CROP_MAPPING = [
  { label: "Rice", value: 0 },
  { label: "Maize", value: 1 },
  { label: "Chickpea", value: 2 },
  { label: "Kidneybeans", value: 3 },
  { label: "Pigeonpeas", value: 4 },
  { label: "Mothbeans", value: 5 },
  { label: "Mungbean", value: 6 },
  { label: "Blackgram", value: 7 },
  { label: "Lentil", value: 8 },
  { label: "Pomegranate", value: 9 },
  { label: "Banana", value: 10 },
  { label: "Mango", value: 11 },
  { label: "Grapes", value: 12 },
  { label: "Watermelon", value: 13 },
  { label: "Muskmelon", value: 14 },
  { label: "Apple", value: 15 },
  { label: "Orange", value: 16 },
  { label: "Papaya", value: 17 },
  { label: "Coconut", value: 18 },
  { label: "Cotton", value: 19 },
  { label: "Jute", value: 20 },
  { label: "Coffee", value: 21 }
];

const SOIL_MAPPING = [
  { label: "Sandy", value: 0 },
  { label: "Loamy", value: 1 },
  { label: "Black", value: 2 },
  { label: "Red", value: 3 },
  { label: "Clayey", value: 4 }
];

/* ================= GAUGE ================= */

const Gauge = ({
  label,
  value,
  max = 100,
  color,
  unit,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  unit: string;
}) => {
  const radius = 80;
  const stroke = 12;
  const ARC = Math.PI * radius;
  const safeId = label.replace(/[^a-zA-Z0-9]/g, "");
  const normalized = Math.min(Math.max(value, 0), max);

  return (
    <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 hover:-translate-y-1 transition-transform group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full" style={{ background: color }}></div>
      </div>
      <svg viewBox="0 0 220 120" className="w-full h-36">
        <defs>
          <linearGradient id={`grad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d="M30 110 A80 80 0 0 1 190 110"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Progress */}
        <motion.path
          d="M30 110 A80 80 0 0 1 190 110"
          fill="none"
          stroke={`url(#grad-${safeId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={ARC}
          strokeDashoffset={ARC}
          animate={{ strokeDashoffset: ARC * (1 - normalized / max) }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (normalized / max) * 180 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 110, originY: 110 }}
        >
          <circle cx="110" cy="110" r="6" fill="#334155" />
          <path d="M110 110 L110 45" stroke="#334155" strokeWidth="3" />
        </motion.g>
      </svg>

      <div className="text-center mt-2">
        <motion.div
          className="text-4xl font-black text-slate-800"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <CountUp end={value} duration={1.2} />
        </motion.div>
        <p className="text-xs font-bold text-slate-400 uppercase">{unit}</p>
        <h4 className="mt-3 font-bold text-slate-700">{label}</h4>
      </div>
    </div>
  );
};

/* ================= COUNT UP ================= */

const CountUp = ({ end, duration }: { end: number; duration: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let start: number | null = null;
    let raf: number;

    const tick = (t: number) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / (duration * 1000), 1);
      setCount(Math.floor(end * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return <>{count}</>;
};

/* ================= MAIN ================= */

export default function FertilizerDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FertilizerData | null>(null);
  const [formData, setFormData] = useState({
    crop: "",
    soil: "",
    area: "",
    moisture: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const runPrediction = async () => {
    if (loading) return;

    // Basic validation
    if (formData.crop === "" || formData.soil === "") {
      alert("Please select both a Crop and Soil Type.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: Number(formData.crop),
          soil: Number(formData.soil),
          area: Number(formData.area) || 0,
          moisture: Number(formData.moisture) || 0
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error("API Error:", data.error);
        alert("Prediction Error: " + data.error);
        // NO FALLBACK - ensure realistic behavior (fail if model fails)
      } else {
        setResult(data);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
      alert("Failed to connect to the prediction engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/50 relative overflow-hidden font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Sprout className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800">
                Fertilizer <span className="text-emerald-600">Ratio</span>
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                Real-Time Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500">SYSTEM ONLINE</span>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: INPUTS */}
          <div className="lg:col-span-4 bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white/50 sticky top-10">
            <h2 className="font-black text-xl flex items-center gap-2 mb-8 text-slate-800">
              <Settings2 className="text-emerald-500 w-6 h-6" />
              Input Parameters
            </h2>

            <div className="space-y-6">

              {/* Crop Input (Select) */}
              <div className="group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-emerald-600 transition-colors">
                  Select Crop
                </label>
                <div className="relative">
                  <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-10 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer hover:bg-white"
                  >
                    <option value="" disabled>Choose crop...</option>
                    {CROP_MAPPING.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Soil Input (Select) */}
              <div className="group">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1 group-focus-within:text-emerald-600 transition-colors">
                  Soil Type
                </label>
                <div className="relative">
                  <TestTube2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  <select
                    name="soil"
                    value={formData.soil}
                    onChange={handleChange}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-10 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer hover:bg-white"
                  >
                    <option value="" disabled>Choose soil type...</option>
                    {SOIL_MAPPING.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Area Input */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                    Area (Ac)
                  </label>
                  <div className="relative">
                    <input
                      name="area"
                      type="number"
                      placeholder="0"
                      value={formData.area}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>
                {/* Moisture Input */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                    Moisture (%)
                  </label>
                  <div className="relative">
                    <input
                      name="moisture"
                      type="number"
                      placeholder="0"
                      value={formData.moisture}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={runPrediction}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Activity className="animate-spin w-5 h-5" /> Analyzing...
                </>
              ) : (
                <>
                  RUN DIAGNOSTICS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* RIGHT: OUTPUT */}
          <div className="lg:col-span-8">
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 min-h-[500px] flex items-center justify-center border border-white/40 shadow-2xl relative overflow-hidden">

              {/* Decorative elements inside card */}
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                <Sprout className="w-64 h-64 text-emerald-900" />
              </div>

              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center relative z-10 max-w-md"
                  >
                    <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-1 ring-slate-100">
                      <Leaf className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">Ready for Analysis</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Select your crop and soil type from the menu to generate a customized fertilizer ratio recommendation.
                    </p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center relative z-10"
                  >
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-10 h-10 text-emerald-600 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Processing Data</h3>
                    <p className="text-slate-500 mt-2">Running inference model...</p>
                  </motion.div>
                )}

                {result && (
                  <motion.div
                    className="w-full relative z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-slate-800 mb-2">Optimal NPK Ratio</h2>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 text-emerald-800 rounded-full text-sm font-bold border border-emerald-200/50">
                        <CheckCircle2 className="w-4 h-4" /> Recommendation Generated
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                      <Gauge label="Nitrogen (N)" value={result.nitrogen} color="#10b981" unit="mg/kg" />
                      <Gauge label="Phosphorus (P)" value={result.phosphorus} color="#0ea5e9" unit="mg/kg" />
                      <Gauge label="Potassium (K)" value={result.potassium} color="#f59e0b" unit="mg/kg" />
                    </div>

                    <div className="mt-10 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900 mb-1">AI Insight</h4>
                        <p className="text-emerald-800/70 text-sm leading-relaxed">
                          Analysis complete based on <strong>{CROP_MAPPING.find(c => c.value === Number(formData.crop))?.label}</strong> in <strong>{SOIL_MAPPING.find(s => s.value === Number(formData.soil))?.label}</strong> soil.
                        </p>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
