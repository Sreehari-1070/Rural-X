import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    MoreVertical,
    Search,
    Filter,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

export default function AdminComplaints() {
    const { t } = useLanguage();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        // Load complaints
        const storedComplaints = JSON.parse(localStorage.getItem('farmer_complaints') || '[]');
        setComplaints(storedComplaints);
    }, []);

    const handleStatusChange = (id: string, newStatus: string) => {
        const updatedComplaints = complaints.map(c =>
            c.id === id ? { ...c, status: newStatus as any } : c
        );
        setComplaints(updatedComplaints);
        localStorage.setItem('farmer_complaints', JSON.stringify(updatedComplaints));
        toast.success(`Ticket #${id.slice(0, 4)} updated to ${newStatus}`);
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'resolved':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Resolved</Badge>;
            case 'in-progress':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">In Progress</Badge>;
            default:
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <span className="text-red-600 font-medium text-xs uppercase">High</span>;
            case 'medium':
                return <span className="text-orange-600 font-medium text-xs uppercase">Medium</span>;
            default:
                return <span className="text-slate-600 font-medium text-xs uppercase">Low</span>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Complaint Management</h1>
                    <p className="text-text-secondary">Track and resolve farmer issues.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-tertiary" />
                        <Input
                            placeholder="Search by ID, name or complaint..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-text-tertiary" />
                        <select
                            className="bg-transparent text-sm font-medium focus:outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Farmer</TableHead>
                                <TableHead>Complaint</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredComplaints.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-text-tertiary">
                                        No complaints found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredComplaints.map((complaint) => (
                                    <TableRow key={complaint.id}>
                                        <TableCell className="font-mono text-xs">{complaint.id.slice(0, 8)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{complaint.farmerName}</div>
                                                <div className="text-xs text-text-tertiary">{complaint.location}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <div className="font-medium truncate">{complaint.title}</div>
                                            <div className="text-xs text-text-tertiary truncate">{complaint.description}</div>
                                        </TableCell>
                                        <TableCell className="capitalize">{complaint.category}</TableCell>
                                        <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                                        <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'pending')}>
                                                        <AlertCircle className="mr-2 h-4 w-4" /> Mark Pending
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'in-progress')}>
                                                        <Clock className="mr-2 h-4 w-4" /> Mark In Progress
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, 'resolved')}>
                                                        <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}
