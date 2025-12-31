
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { CalendarDays, Plus, Sprout, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function GrowthCalendar() {
    const { user } = useAuth();
    const [crops, setCrops] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        crop_name: '',
        sowing_date: '',
        current_stage: 'Germination',
        expected_harvest_date: ''
    });

    const fetchCrops = () => {
        if (!user?.phone) return;
        // Strip +91 for consistency with other backend calls if needed, 
        // but Profile used replace. Let's assume user.phone is consistent or handle it.
        // Ideally backend should handle standardization.
        const phone = user.phone.replace('+91', '');
        fetch(`http://localhost:8001/farmer/growth/${phone}`)
            .then(res => res.json())
            .then(data => setCrops(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCrops();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const phone = user?.phone?.replace('+91', '') || '';
            const res = await fetch('http://localhost:8001/farmer/growth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_phone: phone,
                    ...formData
                })
            });

            if (res.ok) {
                toast.success("Crop added to calendar!");
                setShowForm(false);
                setFormData({ crop_name: '', sowing_date: '', current_stage: 'Germination', expected_harvest_date: '' });
                fetchCrops();
            } else {
                throw new Error("Failed to add crop");
            }
        } catch (e) {
            toast.error("Could not add crop");
        }
    };

    return (
        <FarmerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <CalendarDays className="h-6 w-6 text-primary" />
                            Growth Calendar
                        </h1>
                        <p className="text-text-secondary">Track your crop cycles and harvest dates</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> Add Crop
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden"
                    >
                        <h3 className="mb-4 font-semibold text-foreground">New Crop Cycle</h3>
                        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Crop Name (e.g. Rice, Wheat)"
                                className="input-field"
                                value={formData.crop_name}
                                onChange={e => setFormData({ ...formData, crop_name: e.target.value })}
                                required
                            />
                            <select
                                className="input-field"
                                value={formData.current_stage}
                                onChange={e => setFormData({ ...formData, current_stage: e.target.value })}
                            >
                                <option>Germination</option>
                                <option>Vegetative</option>
                                <option>Flowering</option>
                                <option>Ripening</option>
                                <option>Harvest Ready</option>
                            </select>
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">Sowing Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.sowing_date}
                                    onChange={e => setFormData({ ...formData, sowing_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-text-secondary">Est. Harvest Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.expected_harvest_date}
                                    onChange={e => setFormData({ ...formData, expected_harvest_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save Cycle</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Crops List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {crops.length > 0 ? (
                        crops.map((crop) => (
                            <motion.div
                                key={crop.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Sprout className="h-24 w-24 text-primary" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-foreground mb-1">{crop.crop_name}</h3>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mb-4">
                                        <Sprout className="h-3 w-3" /> {crop.current_stage}
                                    </span>

                                    <div className="space-y-2 text-sm text-text-secondary">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Sowed: {crop.sowing_date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-foreground font-medium">
                                            <CheckCircle className="h-4 w-4 text-success" />
                                            <span>Harvest: {crop.expected_harvest_date}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-text-secondary border-2 border-dashed border-border rounded-xl">
                            <Sprout className="mx-auto h-12 w-12 opacity-20 mb-4" />
                            <p>No active crops found. Start by adding one!</p>
                        </div>
                    )}
                </div>
            </div>
        </FarmerLayout>
    );
}
