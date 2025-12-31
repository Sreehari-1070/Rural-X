import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, FileWarning, Leaf,
  Globe, Radio, BarChart3, Menu, X, LogOut,
  Bell, ChevronRight, Shield
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, labelKey: 'adminDashboard' },
  { path: '/admin/farmers', icon: Users, labelKey: 'farmerManagement' },
  { path: '/admin/complaints', icon: FileWarning, labelKey: 'complaintHandling' },
  { path: '/admin/disease-alerts', icon: Leaf, labelKey: 'diseaseVerification' },
  { path: '/admin/communities', icon: Globe, labelKey: 'communityManagement' },
  { path: '/admin/broadcast', icon: Radio, labelKey: 'broadcastAlerts' },
  { path: '/admin/analytics', icon: BarChart3, labelKey: 'analytics' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <img src="/images/logo.jpg" alt="RuralX Logo" className="h-12 w-auto rounded-xl object-contain" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-2 hover:bg-sidebar-accent lg:hidden"
            >
              <X className="h-5 w-5 text-sidebar-foreground" />
            </button>
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
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all ${isActive
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-text-secondary hover:bg-muted hover:text-foreground'
                        }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Admin Info */}
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-sidebar-accent p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
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
      <div className="flex flex-1 flex-col lg:ml-0">
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
                <span>Admin</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">
                  {t(navItems.find((item) => item.path === location.pathname)?.labelKey || '')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-text-secondary" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
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
