import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sprout, Users, TrendingUp, ChevronRight,
  Leaf, Cloud, Shield, BarChart3, ArrowRight
} from 'lucide-react';
import { LanguageModal } from '@/components/shared/LanguageModal';
import { FloatingLanguageSelector } from '@/components/shared/FloatingLanguageSelector';
import { ChatbotButton } from '@/components/shared/ChatbotButton';

// Background images (using the ones we just copied)
const backgrounds = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate background
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: '10k+', label: t('landingStatsFarmers'), icon: Users },
    { value: '50+', label: t('landingStatsVillages'), icon: TrendingUp },
    { value: '95%', label: t('landingStatsYield'), icon: Sprout },
  ];

  return (
    <>
      <LanguageModal />
      <FloatingLanguageSelector />

      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">

        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${backgrounds[currentSlide]})` }}
            >
              {/* Dark Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">

          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-12"
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              {/* Left Column: Text Content */}
              <div className="space-y-8 text-center lg:text-left">
                {/* Removed AI-Powered Agriculture badge */}

                <motion.img
                  src="/images/logo.jpg"
                  alt="RuralX Logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-20 w-auto rounded-xl object-contain mb-6 mx-auto lg:mx-0 shadow-lg"
                />

                <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                  {t('farmingFor')} <br />
                  <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    {t('futureGeneration')}
                  </span>
                </h1>

                <p className="mx-auto max-w-lg text-lg text-gray-200 lg:mx-0 lg:text-xl">
                  {t('heroDescription')}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap justify-center gap-8 border-t border-white/10 pt-8 lg:justify-start">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                      className="text-center lg:text-left"
                    >
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 uppercase tracking-wider">
                        <stat.icon className="h-3 w-3" /> {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Action Cards */}
              <div className="flex flex-col gap-5">

                {/* Farmer Portal Button */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/farmer/auth')}
                  className="group relative flex w-full items-center justify-between rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-600/80 to-green-600/80 p-6 text-left shadow-lg backdrop-blur-md transition-all hover:bg-emerald-600"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow-inner">
                      👨‍🌾
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{t('farmerPortal')}</h3>
                      <p className="text-sm text-green-100">{t('farmerPortalDesc')}</p>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </motion.button>

                {/* Admin Portal Button */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/admin/auth')}
                  className="group relative flex w-full items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-4xl shadow-inner">
                      👔
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{t('adminPortal')}</h3>
                      <p className="text-sm text-gray-300">{t('adminPortalDesc')}</p>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Footer Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-6 left-0 right-0 text-center text-xs text-gray-400"
          >
            <p>{t('poweredBy')}</p>
          </motion.div>

        </div>

        <ChatbotButton />
      </div>
    </>
  );
}
