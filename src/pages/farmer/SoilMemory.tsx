
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { Mountain, Plus, TestTube, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SoilMemory() {
    const { user } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        ph_level: 6.5,
        nitrogen: 120,
        phosphorus: 40,
        potassium: 150,
        moisture: 45,
        notes: ''
    });

    const fetchLogs = () => {
        if (!user?.phone) return;
        const phone = user.phone.replace('+91', '');
        fetch(`http://localhost:8001/farmer/soil/${phone}`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchLogs();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const phone = user?.phone?.replace('+91', '') || '';
            const res = await fetch('http://localhost:8001/farmer/soil', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_phone: phone,
                    ...formData
                })
            });

            if (res.ok) {
                toast.success("Soil test results saved!");
                setShowForm(false);
                setFormData({ ph_level: 6.5, nitrogen: 120, phosphorus: 40, potassium: 150, moisture: 45, notes: '' });
                fetchLogs();
            } else {
                throw new Error("Failed to save soil log");
            }
        } catch (e) {
            toast.error("Could not save results");
        }
    };

    return (
        <FarmerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Mountain className="h-6 w-6 text-primary" />
                            Soil Memory
                        </h1>
                        <p className="text-text-secondary">Track soil health history and nutrient trends</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Test Result
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden"
                    >
                        <h3 className="mb-4 font-semibold text-foreground">New Soil Test Entry</h3>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">pH Level</label>
                                <input type="number" step="0.1" className="input-field" value={formData.ph_level} onChange={e => setFormData({ ...formData, ph_level: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">Nitrogen (N) kg/ha</label>
                                <input type="number" className="input-field" value={formData.nitrogen} onChange={e => setFormData({ ...formData, nitrogen: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">Phosphorus (P) kg/ha</label>
                                <input type="number" className="input-field" value={formData.phosphorus} onChange={e => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">Potassium (K) kg/ha</label>
                                <input type="number" className="input-field" value={formData.potassium} onChange={e => setFormData({ ...formData, potassium: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">Moisture %</label>
                                <input type="number" className="input-field" value={formData.moisture} onChange={e => setFormData({ ...formData, moisture: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-1 md:col-span-2 lg:col-span-3">
                                <label className="text-xs text-text-secondary">Notes</label>
                                <input type="text" placeholder="e.g. Applied urea yesterday" className="input-field" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save Log</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Charts Section */}
                {logs.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-elevated p-6"
                        >
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                <TrendingUp className="h-5 w-5 text-primary" /> pH History
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={logs}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="test_date" fontSize={12} />
                                        <YAxis domain={[0, 14]} />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                                        <Line type="monotone" dataKey="ph_level" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="card-elevated p-6"
                        >
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                <TestTube className="h-5 w-5 text-secondary" /> NPK Trends
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={logs}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="test_date" fontSize={12} />
                                        <YAxis />
                                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem' }} />
                                        <Line type="monotone" dataKey="nitrogen" stroke="#ef4444" name="N" />
                                        <Line type="monotone" dataKey="phosphorus" stroke="#22c55e" name="P" />
                                        <Line type="monotone" dataKey="potassium" stroke="#3b82f6" name="K" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Recent Logs Table */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border font-semibold">Recent Logs</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">pH</th>
                                <th className="px-4 py-3">N-P-K</th>
                                <th className="px-4 py-3">Moisture</th>
                                <th className="px-4 py-3">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-4 py-3">{log.test_date}</td>
                                        <td className="px-4 py-3 font-medium">{log.ph_level}</td>
                                        <td className="px-4 py-3">{log.nitrogen}-{log.phosphorus}-{log.potassium}</td>
                                        <td className="px-4 py-3">{log.moisture}%</td>
                                        <td className="px-4 py-3 text-text-tertiary truncate max-w-xs">{log.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">No logs yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </FarmerLayout>
    );
}
