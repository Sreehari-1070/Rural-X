
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
    Users, MapPin, Wind, Bell, FileText, Send,
    MessageSquare, CloudSun, Droplets, ArrowRight
} from 'lucide-react';

// Mock Data Types
type Scheme = {
    id: string;
    title: string;
    desc: string;
    deadline: string;
};

type Broadcast = {
    id: string;
    type: 'alert' | 'info' | 'event';
    title: string;
    message: string;
    time: string;
    sender: string;
};

export default function Community() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'feed' | 'weather' | 'schemes'>('feed');

    // Determine location from user profile
    const location = user?.location || 'Unknown District';

    // Mock Data Generators based on location
    const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [weather, setWeather] = useState({ temp: 28, condition: 'Sunny', hum: 65 });

    useEffect(() => {
        if (location) {
            loadCommunityData(location);
        }
    }, [location]);

    const loadCommunityData = (loc: string) => {
        // Generate mock data consistent with location
        setBroadcasts([
            {
                id: '1', type: 'alert',
                title: 'Heavy Rain Alert',
                message: `Heavy rainfall expected in ${loc} region over the next 48 hours. Secure your crops.`,
                time: '2 hours ago', sender: 'Met Dept'
            },
            {
                id: '2', type: 'event',
                title: 'Village Panchayat Meeting',
                message: 'Monthly gathering at the community hall to discuss water distribution.',
                time: '5 hours ago', sender: 'Sarpanch'
            },
            {
                id: '3', type: 'info',
                title: 'Fertilizer Subsidies',
                message: 'New stock of urea available at the local cooperative society.',
                time: '1 day ago', sender: 'Co-op Society'
            },
        ]);

        setSchemes([
            {
                id: 's1', title: 'PM Kisan Samman Nidhi',
                desc: 'Financial support for small and marginal farmers.',
                deadline: 'Mar 31, 2025'
            },
            {
                id: 's2', title: 'Crop Insurance Scheme',
                desc: `Special coverage for ${loc} specific crops like Paddy and Wheat.`,
                deadline: 'Jun 15, 2025'
            },
            {
                id: 's3', title: 'Solar Pump Subsidy',
                desc: '80% subsidy on installation of new solar water pumps.',
                deadline: 'Open'
            },
        ]);
    };

    return (
        <FarmerLayout>
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Community & Updates</h1>
                        <p className="text-text-secondary">Connect with your local farming community</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key="community-dash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Location Banner */}
                        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-white/20 p-3 backdrop-blur-sm">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{location} Community</h2>
                                    <p className="text-violet-100 text-sm">You are connected to local updates</p>
                                </div>
                            </div>
                            {/* Removed Change Location button as it is tied to profile now */}
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {[
                                { id: 'feed', label: 'Broadcasts', icon: MessageSquare },
                                { id: 'weather', label: 'Weather', icon: CloudSun },
                                { id: 'schemes', label: 'Schemes', icon: FileText },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-3 font-medium transition-all ${activeTab === tab.id
                                            ? 'border-violet-500 bg-violet-50 text-violet-700 shadow-sm'
                                            : 'border-border bg-card text-text-secondary hover:bg-muted'
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[400px]">
                            {activeTab === 'feed' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    {broadcasts.map((msg) => (
                                        <div key={msg.id} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${msg.type === 'alert' ? 'bg-red-500' : msg.type === 'event' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />
                                            <div className="ml-3">
                                                <div className="mb-1 flex items-start justify-between">
                                                    <h3 className="font-semibold text-foreground">{msg.title}</h3>
                                                    <span className="text-xs text-text-secondary">{msg.time}</span>
                                                </div>
                                                <p className="text-sm text-text-secondary mb-3">{msg.message}</p>
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center font-bold text-[10px]">
                                                        {msg.sender[0]}
                                                    </div>
                                                    {msg.sender}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'weather' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-white shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-blue-100">Current Weather</p>
                                                <h2 className="mt-2 text-5xl font-bold">{weather.temp}°C</h2>
                                                <p className="mt-1 font-medium">{weather.condition}</p>
                                            </div>
                                            <CloudSun className="h-20 w-20 text-blue-100" />
                                        </div>
                                        <div className="mt-8 flex gap-8 border-t border-white/20 pt-6">
                                            <div>
                                                <p className="flex items-center gap-1 text-xs text-blue-100"><Wind className="h-3 w-3" /> Wind</p>
                                                <p className="font-semibold">12 km/h</p>
                                            </div>
                                            <div>
                                                <p className="flex items-center gap-1 text-xs text-blue-100"><Droplets className="h-3 w-3" /> Humidity</p>
                                                <p className="font-semibold">{weather.hum}%</p>
                                            </div>
                                            <div>
                                                <p className="flex items-center gap-1 text-xs text-blue-100"><CloudSun className="h-3 w-3" /> UV Index</p>
                                                <p className="font-semibold">Moderate</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-foreground">5-Day Forecast</h3>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                                                <span className="text-sm font-medium">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i - 1]}</span>
                                                <CloudSun className="h-5 w-5 text-amber-500" />
                                                <span className="text-sm font-bold text-foreground">{28 + (i % 2)}° / {22 + (i % 2)}°</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'schemes' && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    {schemes.map((scheme) => (
                                        <div key={scheme.id} className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="mb-2 inline-flex rounded-lg bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">Active</div>
                                                    <h3 className="text-lg font-bold text-foreground">{scheme.title}</h3>
                                                    <p className="mt-1 text-sm text-text-secondary">{scheme.desc}</p>
                                                </div>
                                                <div className="rounded-full bg-muted p-2 group-hover:bg-violet-50 group-hover:text-violet-600">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-text-secondary">
                                                <span>Deadline: {scheme.deadline}</span>
                                                <span className="font-medium text-violet-600">Apply Now</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </FarmerLayout>
    );
}
