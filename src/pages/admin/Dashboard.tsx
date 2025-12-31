import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users,
  AlertTriangle,
  MessageSquare,
  Activity,
  TrendingUp,
  MapPin,
  Shield,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';



const districtStats = [
  { name: "Karnal", farmers: 3240, alerts: 5, health: 94 },
  { name: "Panipat", farmers: 2890, alerts: 3, health: 97 },
  { name: "Kurukshetra", farmers: 2156, alerts: 8, health: 88 },
  { name: "Sonipat", farmers: 2012, alerts: 4, health: 92 },
  { name: "Rohtak", farmers: 2160, alerts: 3, health: 95 },
];

const recentAlerts = [
  { type: "Disease", message: "Wheat rust outbreak in Kurukshetra", severity: "high", time: "10 min ago" },
  { type: "Weather", message: "Heavy rain warning for Panipat", severity: "medium", time: "30 min ago" },
  { type: "Fake Product", message: "Counterfeit fertilizer reported in Karnal", severity: "high", time: "1 hour ago" },
  { type: "Pest", message: "Locust movement detected near border", severity: "medium", time: "2 hours ago" },
];

const SystemStatus = ({ name, uptime }: { name: string; uptime: string }) => (
  <div className="p-4 rounded-xl bg-muted/30 border border-border">
    <div className="flex items-center gap-2 mb-2">
      <CheckCircle2 className="w-4 h-4 text-green-600" />
      <span className="font-medium text-sm">{name}</span>
    </div>
    <p className="text-xs text-muted-foreground">Uptime: {uptime}</p>
  </div>
);

export default function AdminDashboard() {
  const { t } = useLanguage();

  const stats = [
    { label: t('totalFarmers'), value: "12,458", change: "+234 this month", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: t('pendingAlerts'), value: "23", change: "5 critical", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
    { label: t('activeComplaints'), value: "47", change: "12 new today", icon: MessageSquare, color: "text-red-600", bg: "bg-red-100" },
    { label: t('systemStatus'), value: "99.2%", change: "All systems operational", icon: Activity, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary" />
              {t('commandCenter')}
            </h1>
            <p className="text-muted-foreground mt-1">{t('systemOverview')}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold">{t('liveSystem')}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    {/* <TrendingUp className="w-4 h-4 text-green-600" /> */}
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{stat.label}</p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* District Overview */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {t('districtOverview')}
                </CardTitle>
                <button className="text-sm text-primary hover:underline">{t('viewAll')}</button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('location')}</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('farmersCount')}</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Active Alerts</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('healthScore')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {districtStats.map((district, index) => (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-medium">{district.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{district.farmers.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge variant={district.alerts > 5 ? "destructive" : "secondary"} className={district.alerts > 5 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}>
                              {district.alerts} Alerts
                            </Badge>
                          </td>
                          <td className="py-3 px-4 w-48">
                            <div className="flex items-center gap-3">
                              <Progress value={district.health} className="h-2" />
                              <span className={`text-sm font-medium ${district.health > 90 ? 'text-green-600' : 'text-amber-600'}`}>
                                {district.health}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  {t('recentAlerts')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className={`${alert.severity === 'high' ? 'text-red-600 border-red-200 bg-red-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                          {alert.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm text-foreground font-medium">{alert.message}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium">
                  {t('viewAllAlerts')}
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                {t('systemStatus')}
              </CardTitle>
              <Badge className="bg-green-100 text-green-700">{t('allSystemsOperational')}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SystemStatus name="Database" uptime="99.99%" />
                <SystemStatus name="Authentication" uptime="100%" />
                <SystemStatus name="Alert Service" uptime="99.95%" />
                <SystemStatus name="Analytics" uptime="99.90%" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </AdminLayout>
  );
}
