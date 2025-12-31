import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Leaf, CloudRain, CalendarDays,
  Mountain, Cloud, Users, FileWarning, User,
  Menu, X, LogOut, Bell, MapPin, ChevronRight,
  Droplet, Wind
} from 'lucide-react';

const navItems = [
  { path: '/farmer/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/farmer/disease', icon: Leaf, labelKey: 'diseaseDetection' },
  { path: '/farmer/disaster', icon: CloudRain, labelKey: 'disasterManagement' },
  { path: '/farmer/growth', icon: CalendarDays, labelKey: 'growthCalendar' },
  { path: '/farmer/soil', icon: Mountain, labelKey: 'soilMemory' },
  { path: '/farmer/weather', icon: Cloud, labelKey: 'weatherAlerts' },
  { path: '/farmer/irrigation', icon: Droplet, labelKey: 'irrigationSystem' },
  { path: '/farmer/fertilizer', icon: Wind, labelKey: 'fertilizerAdvisor' },
  { path: '/farmer/community', icon: Users, labelKey: 'community' },
  { path: '/farmer/complaints', icon: FileWarning, labelKey: 'complaints' },
  { path: '/farmer/profile', icon: User, labelKey: 'profile' },
];

interface FarmerLayoutProps {
  children: React.ReactNode;
}

export default function FarmerLayout({ children }: FarmerLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
            <Link to="/farmer/dashboard" className="flex items-center gap-3">
              <img src="/images/logo.jpg" alt="RuralX Logo" className="h-12 w-auto rounded-xl object-contain" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-2 hover:bg-sidebar-accent lg:hidden"
            >
              <X className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user?.name?.charAt(0) || 'F'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">{user?.name || 'Farmer'}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {user?.location || 'Chennai'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={isActive ? 'nav-link-active' : 'nav-link'}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t border-sidebar-border p-4">
            <button
              onClick={handleLogout}
              className="nav-link w-full text-danger hover:bg-danger/10"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 lg:ml-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            {navItems.find((item) => item.path === location.pathname) && (
              <div className="flex items-center gap-2 text-text-secondary">
                <span>{t('dashboard')}</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {t(navItems.find((item) => item.path === location.pathname)?.labelKey || '')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative rounded-lg p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-text-secondary" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
            </button>

            {/* Profile */}
            <Link
              to="/farmer/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              {user?.name?.charAt(0) || 'F'}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
