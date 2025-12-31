
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { User, Phone, MapPin, Save, Loader2, Sprout, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
    const { user, login } = useAuth();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        location: user?.location || '',
        landArea: user?.landArea || 5.0,
        soilType: user?.soilType || 'Loamy'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'landArea' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8001/auth/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: user?.phone?.replace('+91', ''), // Backend expects raw number or consistent format. Assuming simlple match for now.
                    ...formData
                })
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await res.json();
            login(updatedUser); // Update local context
            toast.success('Profile updated successfully!');

        } catch (error) {
            console.error(error);
            toast.error('Could not update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FarmerLayout>
            <div className="mx-auto max-w-2xl space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="text-text-secondary">Manage your account settings and farm details</p>
                </div>

                <div className="grid gap-6">
                    {/* Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                            {user?.name?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                            <p className="text-text-secondary flex items-center gap-2">
                                <Phone className="h-4 w-4" /> {user?.phone}
                            </p>
                            <span className="mt-2 inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                                {user?.role === 'farmer' ? 'Verified Farmer' : 'User'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Edit Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6"
                    >
                        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-4">Edit Details</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" /> District / Location
                                </label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="Chennai">Chennai</option>
                                    <option value="Madurai">Madurai</option>
                                    <option value="Coimbatore">Coimbatore</option>
                                    <option value="Trichy">Trichy</option>
                                    <option value="Salem">Salem</option>
                                    <option value="Thanjavur">Thanjavur</option>
                                    <option value="Erode">Erode</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Sprout className="h-4 w-4 text-primary" /> Land Area (Acres)
                                </label>
                                <input
                                    type="number"
                                    name="landArea"
                                    value={formData.landArea}
                                    onChange={handleChange}
                                    step="0.1"
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" /> Soil Type
                                </label>
                                <select
                                    name="soilType"
                                    value={formData.soilType}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="Clay">Clay</option>
                                    <option value="Sandy">Sandy</option>
                                    <option value="Loamy">Loamy</option>
                                    <option value="Silt">Silt</option>
                                    <option value="Peaty">Peaty</option>
                                    <option value="Chalky">Chalky</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </FarmerLayout>
    );
}
