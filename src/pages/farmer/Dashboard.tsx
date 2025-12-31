import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { ChatbotButton } from '@/components/shared/ChatbotButton';
import {
  Sprout, Thermometer, Droplets, BarChart3,
  Droplet, Wind, ExternalLink, Megaphone, Calendar, ArrowRight,
  TrendingUp, TrendingDown, Clock, Lightbulb, BellRing
} from 'lucide-react';

const marketRates = [
  { crop: "Rice (Basmati)", price: "₹3,200/qt", trend: "up" },
  { crop: "Wheat", price: "₹2,100/qt", trend: "stable" },
  { crop: "Cotton", price: "₹6,400/qt", trend: "down" },
  { crop: "Sugarcane", price: "₹340/qt", trend: "up" },
  { crop: "Maize", price: "₹1,950/qt", trend: "up" },
];

const smartTips = [
  "Monitor soil moisture before irrigating to save water.",
  "Early detection of pests can save 40% of your yield.",
  "Consider crop rotation to maintain soil nitrogen levels.",
  "Update your growth calendar weekly for better predictions."
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentTip, setCurrentTip] = useState(0);

  const firstName = user?.name?.split(' ')[0] || 'Farmer';
  const location = user?.location || 'Unknown Location';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('goodMorning'));
    else if (hour < 18) setGreeting(t('goodAfternoon'));
    else setGreeting(t('goodEvening'));

    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % smartTips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [t]);

  const quickStats = [
    { icon: Sprout, label: 'myCrops', value: '5 Active', color: 'text-primary', subtext: '+1 from last week' },
    { icon: Thermometer, label: 'weather', value: '28°C Sunny', color: 'text-warning', subtext: 'High of 32°C' },
    { icon: Droplets, label: 'soilHealth', value: 'Good', color: 'text-secondary', subtext: 'pH 6.5 (Optimal)' },
    { icon: BarChart3, label: 'growthStage', value: 'Day 45/90', color: 'text-success', subtext: 'Flowering Phase' },
  ];

  const nearbyUpdates = [
    { id: 1, title: 'Heavy Rain Alert', sender: 'Met Dept', time: '2h ago', type: 'alert' },
    { id: 2, title: 'Panchayat Meeting', sender: 'Sarpanch', time: '5h ago', type: 'info' },
    { id: 3, title: 'Subsidy Scheme', sender: 'Govt', time: '1d ago', type: 'success' },
  ];

  const miniForecast = [
    { day: 'Tue', temp: '29°', icon: '☀️' },
    { day: 'Wed', temp: '28°', icon: 'cloud' },
    { day: 'Thu', temp: '27°', icon: '🌧️' },
  ];

  return (
    <FarmerLayout>
      <div className="space-y-6 pb-20 max-w-full overflow-x-hidden">

        {/* Header Section with Time & Greeting */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-primary mb-1"
            >
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t('liveDashboard')}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-foreground md:text-4xl"
            >
              {greeting}, {firstName}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary mt-1"
            >
              {t('happeningIn')} <span className="font-semibold text-foreground">{location}</span> {t('today')}.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-sm"
          >
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </motion.div>
        </div>

        {/* Live Market Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <div className="flex px-4 py-3 gap-8 animate-scroll whitespace-nowrap min-w-full">
            {[...marketRates, ...marketRates].map((rate, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium">
                <span className="text-foreground">{rate.crop}</span>
                <span className="text-primary">{rate.price}</span>
                {rate.trend === 'up' && <TrendingUp className="h-3 w-3 text-success" />}
                {rate.trend === 'down' && <TrendingDown className="h-3 w-3 text-danger" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="stat-card group relative overflow-hidden bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all"
            >
              {/* Background Pattern */}
              <div className="absolute right-0 top-0 h-24 w-24 opacity-[0.03] -rotate-12 transition-transform group-hover:scale-110">
                <stat.icon className="h-full w-full" />
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm text-text-secondary mb-1">{t(stat.label)}</p>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${stat.color.replace('text-', 'bg-')}`} />
                    <span className="text-xs text-text-tertiary">{stat.subtext}</span>
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">

          {/* Left Column: Updates & Smart Tip */}
          <div className="xl:col-span-2 space-y-6">
            {/* Community Updates */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm h-full"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <BellRing className="h-5 w-5 text-primary" />
                  {t('liveUpdates')}
                </h2>
                <button
                  onClick={() => navigate('/farmer/community')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t('viewAll')}
                </button>
              </div>

              <div className="space-y-3">
                {nearbyUpdates.map((update) => (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={update.id}
                    className="flex items-center gap-4 rounded-2xl bg-muted/30 p-4 border border-border/50 hover:bg-muted/60 hover:border-border transition-all cursor-pointer"
                  >
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${update.type === 'alert' ? 'bg-red-100 text-red-600' :
                      update.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{update.title}</h3>
                      <p className="text-sm text-text-secondary truncate">{update.sender}</p>
                    </div>
                    <span className="text-xs font-medium text-text-tertiary whitespace-nowrap bg-background px-3 py-1 rounded-full border border-border">
                      {update.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>


          </div>

          {/* Right Column: Weather & Actions */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-3xl border border-border bg-gradient-to-b from-sky-400 to-blue-500 p-6 text-white shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-[-20px] right-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-[-20px] left-[-20px] h-32 w-32 rounded-full bg-blue-300/20 blur-2xl" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <span className="glass-panel px-3 py-1 text-xs font-medium bg-white/20 rounded-full border border-white/20">{t('now')}</span>
                <Calendar className="h-5 w-5 opacity-80" />
              </div>

              <div className="text-center mb-8 relative z-10">
                <div className="text-6xl font-bold tracking-tighter mb-2">28°</div>
                <div className="text-lg font-medium opacity-90">Sunny & Clear</div>
                <div className="text-sm opacity-75 mt-1">{location}</div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-white/20 pt-4 relative z-10">
                {miniForecast.map((day) => (
                  <div key={day.day} className="text-center p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <div className="text-xs font-medium opacity-80">{day.day}</div>
                    <div className="text-xl my-1">{day.icon === 'cloud' ? '☁️' : day.icon === '☀️' ? '☀️' : '🌧️'}</div>
                    <div className="font-bold text-sm">{day.temp}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Premium Tools Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              {t('externalFeatures')}
            </h2>
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {t('aiPowered')}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Irrigation Tool */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => navigate('/farmer/irrigation')}
              className="group cursor-pointer relative overflow-hidden rounded-3xl border border-border bg-card p-1 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Droplet className="h-6 w-6" />
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                  {t('irrigationSystem')}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {t('irrigationDesc')}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {t('launchTool')} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            {/* Fertilizer Tool */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => navigate('/farmer/fertilizer')}
              className="group cursor-pointer relative overflow-hidden rounded-3xl border border-border bg-card p-1 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <Wind className="h-6 w-6" />
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-green-600 transition-colors">
                  {t('fertilizerAdvisor')}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Get precise NPK ratios recommendations.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-wider">
                  Launch Tool <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

      </div>
      <ChatbotButton />
    </FarmerLayout>
  );
}
