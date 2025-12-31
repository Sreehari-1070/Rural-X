import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    Bug,
    Package,
    Image as ImageIcon,
    MapPin,
    ChevronRight,
    Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Alert {
    id: string;
    type: "disease" | "fake_product";
    title: string;
    reportedBy: string;
    district: string;
    confidence: number;
    status: "pending" | "verified" | "rejected";
    time: string;
    imageUrl?: string;
}

const mockAlerts: Alert[] = [
    {
        id: "ALT-001",
        type: "disease",
        title: "Yellow Rust in Wheat",
        reportedBy: "Rajesh Singh",
        district: "Kurukshetra",
        confidence: 67,
        status: "pending",
        time: "30 min ago",
    },
    {
        id: "ALT-002",
        type: "fake_product",
        title: "Suspicious NPK Fertilizer",
        reportedBy: "Mohan Lal",
        district: "Karnal",
        confidence: 45,
        status: "pending",
        time: "1 hour ago",
    },
    {
        id: "ALT-003",
        type: "disease",
        title: "Brown Plant Hopper in Rice",
        reportedBy: "Hari Prasad",
        district: "Panipat",
        confidence: 82,
        status: "verified",
        time: "3 hours ago",
    },
    {
        id: "ALT-004",
        type: "fake_product",
        title: "Counterfeit Pesticide",
        reportedBy: "Vikram Singh",
        district: "Sonipat",
        confidence: 91,
        status: "verified",
        time: "5 hours ago",
    },
    {
        id: "ALT-005",
        type: "disease",
        title: "Leaf Blight - False Positive",
        reportedBy: "Suresh Kumar",
        district: "Rohtak",
        confidence: 23,
        status: "rejected",
        time: "1 day ago",
    },
];

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
);

export default function DiseaseAlerts() {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");

    const filteredAlerts = filter === "all"
        ? mockAlerts
        : mockAlerts.filter(a => a.status === filter);

    const pendingCount = mockAlerts.filter(a => a.status === "pending").length;

    return (
        <AdminLayout>
            <div className="space-y-6 pb-20">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                            Alert Verification
                        </h1>
                        <p className="text-muted-foreground mt-1">Review and verify disease and product alerts</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1 text-sm">
                        {pendingCount} Pending Review
                    </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card
                        className={`text-center cursor-pointer transition-all hover:shadow-md ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setFilter("all")}
                    >
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-foreground">{mockAlerts.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Total</p>
                        </CardContent>
                    </Card>
                    <Card
                        className={`text-center cursor-pointer transition-all hover:shadow-md ${filter === 'pending' ? 'ring-2 ring-amber-500' : ''}`}
                        onClick={() => setFilter("pending")}
                    >
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-amber-600">{mockAlerts.filter(a => a.status === "pending").length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Pending</p>
                        </CardContent>
                    </Card>
                    <Card
                        className={`text-center cursor-pointer transition-all hover:shadow-md ${filter === 'verified' ? 'ring-2 ring-green-600' : ''}`}
                        onClick={() => setFilter("verified")}
                    >
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-green-600">{mockAlerts.filter(a => a.status === "verified").length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Verified</p>
                        </CardContent>
                    </Card>
                    <Card
                        className={`text-center cursor-pointer transition-all hover:shadow-md ${filter === 'rejected' ? 'ring-2 ring-red-600' : ''}`}
                        onClick={() => setFilter("rejected")}
                    >
                        <CardContent className="p-4">
                            <p className="text-2xl font-bold text-red-600">{mockAlerts.filter(a => a.status === "rejected").length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Rejected</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Alerts List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Filter className="w-4 h-4" />
                            Showing {filteredAlerts.length} {filter} alerts
                        </div>

                        {filteredAlerts.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground">No alerts found.</p>
                            </div>
                        )}

                        {filteredAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all hover:border-primary/50 ${selectedAlert?.id === alert.id ? "ring-2 ring-primary shadow-md" : ""}`}
                                    onClick={() => setSelectedAlert(alert)}
                                >
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alert.type === "disease" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                            {alert.type === "disease" ? <Bug className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-muted-foreground">{alert.id}</span>
                                                <Badge
                                                    variant="secondary"
                                                    className={`capitalize text-xs font-normal ${alert.status === "verified" ? "bg-green-100 text-green-700" :
                                                            alert.status === "rejected" ? "bg-red-100 text-red-700" :
                                                                "bg-amber-100 text-amber-700"
                                                        }`}
                                                >
                                                    {alert.status}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold text-foreground truncate">{alert.title}</h3>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span className="truncate">By: {alert.reportedBy}</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {alert.district}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {alert.time}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block text-right shrink-0">
                                            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                                            <p className={`font-bold ${alert.confidence > 70 ? "text-green-600" :
                                                    alert.confidence > 40 ? "text-amber-600" :
                                                        "text-red-600"
                                                }`}>{alert.confidence}%</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground self-center" />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <AnimatePresence mode='wait'>
                            {selectedAlert ? (
                                <motion.div
                                    key={selectedAlert.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Card className="overflow-hidden border-primary/20 shadow-lg">
                                        <CardHeader className="bg-muted/30 pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">Alert Details</CardTitle>
                                                <Badge className={`capitalize ${selectedAlert.status === "verified" ? "bg-green-100 text-green-700" :
                                                        selectedAlert.status === "rejected" ? "bg-red-100 text-red-700" :
                                                            "bg-amber-100 text-amber-700"
                                                    }`}>
                                                    {selectedAlert.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6 pt-6">
                                            <div className="aspect-video rounded-xl bg-muted flex items-center justify-center border border-border">
                                                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                                            </div>

                                            <div className="space-y-1">
                                                <DetailRow label="Alert ID" value={selectedAlert.id} />
                                                <DetailRow label="Type" value={selectedAlert.type === "disease" ? "Disease Detection" : "Fake Product"} />
                                                <DetailRow label="Title" value={selectedAlert.title} />
                                                <DetailRow label="Reported By" value={selectedAlert.reportedBy} />
                                                <DetailRow label="District" value={selectedAlert.district} />
                                                <DetailRow label="Time" value={selectedAlert.time} />
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">AI Confidence</span>
                                                    <span className={`font-medium ${selectedAlert.confidence > 70 ? "text-green-600" :
                                                            selectedAlert.confidence > 40 ? "text-amber-600" :
                                                                "text-red-600"
                                                        }`}>{selectedAlert.confidence}%</span>
                                                </div>
                                                <Progress
                                                    value={selectedAlert.confidence}
                                                    className="h-2"
                                                // color class handling is tricky with standard Progress component, usually relies on text color utility on wrapper or custom component.
                                                // Using generic progress for now.
                                                />
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    {selectedAlert.confidence > 70 ? "High confidence - likely accurate" :
                                                        selectedAlert.confidence > 40 ? "Medium confidence - requires review" :
                                                            "Low confidence - may be false positive"}
                                                </p>
                                            </div>

                                            {selectedAlert.status === "pending" && (
                                                <div className="flex gap-3 pt-4 border-t border-border">
                                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Verify
                                                    </Button>
                                                    <Button variant="destructive" className="flex-1 gap-2">
                                                        <XCircle className="w-4 h-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <Card className="border-dashed h-96 flex items-center justify-center text-center p-6 bg-muted/10">
                                    <div>
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertTriangle className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="text-lg font-medium text-foreground">No Alert Selected</h3>
                                        <p className="text-muted-foreground mt-1">Select an alert from the list to view details and take action.</p>
                                    </div>
                                </Card>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
