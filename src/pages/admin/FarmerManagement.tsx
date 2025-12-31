import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    UserCog,
    Search,
    Filter,
    Download,
    MoreVertical,
    MapPin,
    Clock,
    ChevronRight
} from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Farmer {
    id: string;
    name: string;
    district: string;
    phone: string;
    farmSize: string;
    status: "active" | "pending" | "inactive";
    lastActive: string;
    crops: string[];
}

const mockFarmers: Farmer[] = [
    { id: "FRM-001", name: "Rajesh Singh", district: "Karnal", phone: "+91 98765 43210", farmSize: "12 acres", status: "active", lastActive: "2 hours ago", crops: ["Wheat", "Rice"] },
    { id: "FRM-002", name: "Suresh Kumar", district: "Panipat", phone: "+91 98765 43211", farmSize: "8 acres", status: "active", lastActive: "5 hours ago", crops: ["Cotton", "Maize"] },
    { id: "FRM-003", name: "Mohan Lal", district: "Kurukshetra", phone: "+91 98765 43212", farmSize: "15 acres", status: "pending", lastActive: "1 day ago", crops: ["Sugarcane"] },
    { id: "FRM-004", name: "Hari Prasad", district: "Sonipat", phone: "+91 98765 43213", farmSize: "6 acres", status: "active", lastActive: "3 hours ago", crops: ["Vegetables"] },
    { id: "FRM-005", name: "Vikram Singh", district: "Rohtak", phone: "+91 98765 43214", farmSize: "20 acres", status: "inactive", lastActive: "1 week ago", crops: ["Wheat", "Mustard"] },
];

export default function FarmerManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("all");

    const filteredFarmers = mockFarmers.filter(farmer => {
        const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDistrict = selectedDistrict === "all" || farmer.district === selectedDistrict;
        return matchesSearch && matchesDistrict;
    });

    const districts = [...new Set(mockFarmers.map(f => f.district))];

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                            <UserCog className="w-8 h-8 text-primary" />
                            Farmers Management
                        </h1>
                        <p className="text-muted-foreground mt-1">View and manage registered farmers</p>
                    </div>
                    <Button className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Data
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center shadow-sm">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-foreground">12,458</p>
                            <p className="text-sm text-muted-foreground">Total Farmers</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center shadow-sm">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-green-600">11,892</p>
                            <p className="text-sm text-muted-foreground">Active</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center shadow-sm">
                        <CardContent className="p-6">
                            <p className="text-3xl font-bold text-amber-600">566</p>
                            <p className="text-sm text-muted-foreground">Pending Verification</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search farmers by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-muted/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="px-4 py-2 rounded-md bg-transparent border border-input text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <option value="all">All Districts</option>
                            {districts.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Farmers Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Farmer</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">District</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Farm Size</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Crops</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Last Active</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFarmers.map((farmer) => (
                                    <tr key={farmer.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-medium text-foreground">{farmer.name}</p>
                                                <p className="text-xs text-muted-foreground">{farmer.id}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {farmer.district}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-muted-foreground text-sm">{farmer.farmSize}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-1 flex-wrap">
                                                {farmer.crops.map(crop => (
                                                    <span key={crop} className="px-2 py-0.5 text-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                                                        {crop}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge
                                                variant="outline"
                                                className={`capitalize ${farmer.status === 'active' ? 'text-green-600 bg-green-50 border-green-200' : farmer.status === 'pending' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-50 border-slate-200'}`}
                                            >
                                                {farmer.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {farmer.lastActive}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Contact</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredFarmers.length} of {mockFarmers.length} farmers
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="secondary" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
                            <Button variant="outline" size="sm">2</Button>
                            <Button variant="outline" size="sm">3</Button>
                            <Button variant="outline" size="sm">Next</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
