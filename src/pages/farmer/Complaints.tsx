import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import FarmerLayout from '@/components/layout/FarmerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Send,
    AlertCircle,
    CheckCircle2,
    History,
    Clock,
    MessageSquareWarning
} from 'lucide-react';
import { toast } from 'sonner';

interface Complaint {
    id: string;
    farmerId: string;
    farmerName: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'resolved';
    date: string;
    location: string;
}

export default function FarmerComplaints() {
    const { t } = useLanguage();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
    });

    const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Load complaints from local storage
        const storedComplaints = JSON.parse(localStorage.getItem('farmer_complaints') || '[]');
        // Filter for current user if applicable, otherwise just show all for demo
        // Ideally filter by farmerId, but for now we'll just show the ones this user "owns"
        // relying on the simulate logic.
        if (user) {
            setMyComplaints(storedComplaints.filter((c: Complaint) => c.farmerId === user.id));
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            const newComplaint: Complaint = {
                id: crypto.randomUUID(),
                farmerId: user.id || 'guest',
                farmerName: user.name || 'Anonymous Farmer',
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority as 'low' | 'medium' | 'high',
                status: 'pending',
                date: new Date().toISOString(),
                location: user.location || 'Unknown'
            };

            const existingComplaints = JSON.parse(localStorage.getItem('farmer_complaints') || '[]');
            const updatedComplaints = [newComplaint, ...existingComplaints];
            localStorage.setItem('farmer_complaints', JSON.stringify(updatedComplaints));

            setMyComplaints(prev => [newComplaint, ...prev]);
            setFormData({ title: '', description: '', category: 'general', priority: 'medium' });
            setIsSubmitting(false);
            toast.success('Complaint submitted successfully!');
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'text-green-600 bg-green-100';
            case 'in-progress': return 'text-blue-600 bg-blue-100';
            default: return 'text-amber-600 bg-amber-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 border-red-200 bg-red-50';
            case 'medium': return 'text-orange-600 border-orange-200 bg-orange-50';
            default: return 'text-slate-600 border-slate-200 bg-slate-50';
        }
    };

    return (
        <FarmerLayout>
            <div className="space-y-8 pb-20 max-w-5xl mx-auto">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Complaints & Suggestions</h1>
                    <p className="text-text-secondary mt-2">
                        Raise issues directly to the administration. We are here to help you.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">

                    {/* Submission Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquareWarning className="h-5 w-5 text-primary" />
                                    New Complaint
                                </CardTitle>
                                <CardDescription>
                                    Please provide detailed information to help us resolve the issue faster.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Issue Title</label>
                                        <Input
                                            placeholder="Brief title of the problem"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">General</SelectItem>
                                                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                                    <SelectItem value="financial">Financial / Subsidy</SelectItem>
                                                    <SelectItem value="market">Market Related</SelectItem>
                                                    <SelectItem value="water">Water / Irrigation</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Priority</label>
                                            <Select
                                                value={formData.priority}
                                                onValueChange={(val) => setFormData({ ...formData, priority: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            placeholder="Explain the issue in detail..."
                                            className="min-h-[120px]"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full gap-2"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            >
                                                <Clock className="h-4 w-4" />
                                            </motion.div>
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* History List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <History className="h-5 w-5 text-text-secondary" />
                                Ticket History
                            </h2>
                        </div>

                        <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {myComplaints.length === 0 ? (
                                <div className="text-center py-10 opacity-50 border-2 border-dashed border-border rounded-xl">
                                    <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-text-tertiary" />
                                    <p>No complaints raised yet</p>
                                </div>
                            ) : (
                                myComplaints.map((complaint, i) => (
                                    <motion.div
                                        key={complaint.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                        className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                                                {complaint.priority.toUpperCase()}
                                            </div>
                                            <span className="text-xs text-text-tertiary">
                                                {new Date(complaint.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-1">{complaint.title}</h3>
                                        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                                            {complaint.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-3 border-t border-border">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1.5 ${getStatusColor(complaint.status)}`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {complaint.status.replace('-', ' ').toUpperCase()}
                                            </span>
                                            <span className="text-xs text-text-tertiary capitalize">
                                                {complaint.category}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </FarmerLayout>
    );
}
