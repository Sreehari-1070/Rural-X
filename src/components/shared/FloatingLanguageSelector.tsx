import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, X, Check } from 'lucide-react';
import { Language } from '@/lib/translations';

const languages = [
    { code: 'en', label: 'English', countryCode: 'GB' },
    { code: 'ta', label: 'Tamil', countryCode: 'IN' },
    { code: 'hi', label: 'Hindi', countryCode: 'IN' },
];

export function FloatingLanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-16 right-0 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
                    >
                        <div className="p-4">
                            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                Select Language
                            </h3>
                            <div className="space-y-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code as Language);
                                            setIsOpen(false);
                                        }}
                                        className={`group flex w-full items-center justify-between rounded-lg px-4 py-3 transition-all ${language === lang.code
                                                ? 'bg-[#1e3a2a] text-white'
                                                : 'text-gray-300 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-gray-300">
                                                {lang.countryCode}
                                            </span>
                                            <span className={`text-sm ${language === lang.code ? 'font-medium' : 'font-normal'}`}>
                                                {lang.label}
                                            </span>
                                        </div>
                                        {language === lang.code && (
                                            <motion.div
                                                layoutId="activeLang"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                            >
                                                <Check className="h-4 w-4 text-green-400" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/10 shadow-lg backdrop-blur-md transition-all ${isOpen
                    ? 'bg-white text-black'
                    : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="h-5 w-5" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="globe"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                        >
                            <Globe className="h-5 w-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
