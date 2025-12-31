import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    AlertTriangle,
    MessageSquare,
    Activity,
    MapPin,
    AreaChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart as RechartsAreaChart,
    Area
} from 'recharts';

const kpiData = [
    { label: "Total Farmers", value: "12,458", change: "+5.2%", trend: "up", icon: Users },
    { label: "Active Alerts", value: "23", change: "-12%", trend: "down", icon: AlertTriangle },
    { label: "Complaints Resolved", value: "89%", change: "+3.4%", trend: "up", icon: MessageSquare },
    { label: "System Uptime", value: "99.9%", change: "+0.1%", trend: "up", icon: Activity },
];

const monthlyData = [
    { month: "Jul", farmers: 9800, alerts: 45, complaints: 120 },
    { month: "Aug", farmers: 10200, alerts: 52, complaints: 98 },
    { month: "Sep", farmers: 10800, alerts: 38, complaints: 85 },
    { month: "Oct", farmers: 11400, alerts: 61, complaints: 112 },
    { month: "Nov", farmers: 11900, alerts: 34, complaints: 78 },
    { month: "Dec", farmers: 12458, alerts: 23, complaints: 67 },
];

const districtHeatmap = [
    { name: "Karnal", value: 94, color: "text-green-600" },
    { name: "Panipat", value: 88, color: "text-green-600" },
    { name: "Kurukshetra", value: 72, color: "text-amber-500" },
    { name: "Sonipat", value: 91, color: "text-green-600" },
    { name: "Rohtak", value: 85, color: "text-green-600" },
    { name: "Ambala", value: 78, color: "text-amber-500" },
    { name: "Hisar", value: 82, color: "text-green-600" },
    { name: "Sirsa", value: 68, color: "text-amber-500" },
];

const topIssues = [
    { issue: "Pest Infestation", count: 234, percentage: 32 },
    { issue: "Water Shortage", count: 189, percentage: 26 },
    { issue: "Fake Products", count: 156, percentage: 21 },
    { issue: "Crop Disease", count: 98, percentage: 13 },
    { issue: "Subsidy Issues", count: 58, percentage: 8 },
];

export default function Analytics() {
    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-primary" />
                            Analytics Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">System performance and trend analysis</p>
                    </div>
                    <div className="hidden sm:block">
                        <select className="px-4 py-2 rounded-xl bg-card border border-input focus:border-primary outline-none shadow-sm">
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                            <option>This Year</option>
                        </select>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiData.map((kpi, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <kpi.icon className="w-5 h-5" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${kpi.trend === "up" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                                        }`}>
                                        {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {kpi.change}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Farmer Growth Chart */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Farmer Registration Trend</CardTitle>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+27% this quarter</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsAreaChart data={monthlyData}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ stroke: '#16a34a', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <Area type="monotone" dataKey="farmers" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorFarmers)" />
                                        </RechartsAreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* District Health Heatmap */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="w-5 h-5 text-primary" />
                                District Health
                            </CardTitle>
                            <CardDescription>Performance score by region</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 pt-2">
                                {districtHeatmap.map((district, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <span className="w-24 text-sm text-muted-foreground truncate">{district.name}</span>
                                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${district.value > 80 ? 'bg-green-500' : district.value > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${district.value}%` }}
                                            />
                                        </div>
                                        <span className={`w-12 text-sm font-medium text-right ${district.color}`}>{district.value}%</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs text-muted-foreground">&gt;80%</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span className="text-xs text-muted-foreground">60-80%</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-xs text-muted-foreground">&lt;60%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Top Issues */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Top Reported Issues</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {topIssues.map((issue, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-foreground">{issue.issue}</span>
                                            <span className="text-sm text-muted-foreground">{issue.count} reports</span>
                                        </div>
                                        <Progress value={issue.percentage} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Monthly Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        />
                                        <Bar dataKey="alerts" name="Alerts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="complaints" name="Complaints" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
