import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function OfflineBanner() {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed left-0 right-0 top-0 z-50 bg-warning px-4 py-3 text-warning-foreground shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5" />
              <div>
                <span className="font-semibold">{t('offline')}</span>
                <span className="ml-2 text-sm opacity-90">{t('offlineMessage')}</span>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-lg bg-warning-foreground/20 px-4 py-2 font-medium transition-colors hover:bg-warning-foreground/30"
            >
              <RefreshCw className="h-4 w-4" />
              {t('retryConnection')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
