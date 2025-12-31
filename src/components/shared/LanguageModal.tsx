import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';
import { Check } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', countryCode: 'GB', native: 'English' },
  { code: 'ta', label: 'Tamil', countryCode: 'IN', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', countryCode: 'IN', native: 'हिंदी' },
];

export function LanguageModal() {
  const { isLanguageSet, setLanguage } = useLanguage();

  if (isLanguageSet) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2a2a2a] text-3xl shadow-inner ring-1 ring-white/10">
                  🌾
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-white">
                Welcome to RuralX
              </h1>
              <p className="text-xs text-gray-400">
                Please select your preferred language
              </p>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <h3 className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Available Languages
              </h3>

              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setLanguage(lang.code as Language)}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-4 transition-all hover:bg-white/10 hover:border-white/10 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-8 w-10 items-center justify-center rounded bg-[#252525] font-mono text-xs font-bold text-gray-400 ring-1 ring-white/10 group-hover:text-gray-300">
                        {lang.countryCode}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-200 group-hover:text-white">
                          {lang.native}
                        </p>
                        <p className="text-xs text-gray-500">
                          {lang.label}
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
