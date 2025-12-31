import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Users,
    Send,
    AlertTriangle,
    Bug,
    Droplets,
    Package,
    Radio,
    MapPin,
    Clock,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type AlertType = "disease" | "fake_product" | "water" | "pest" | "general";

const alertTypes = [
    { id: "disease", label: "Disease Alert", icon: Bug, color: "text-red-500 bg-red-50 border-red-200" },
    { id: "fake_product", label: "Fake Product", icon: Package, color: "text-amber-500 bg-amber-50 border-amber-200" },
    { id: "water", label: "Water Alert", icon: Droplets, color: "text-blue-500 bg-blue-50 border-blue-200" },
    { id: "pest", label: "Pest Alert", icon: Bug, color: "text-orange-500 bg-orange-50 border-orange-200" },
    { id: "general", label: "General", icon: Radio, color: "text-slate-500 bg-slate-50 border-slate-200" },
];

const districts = ["All Districts", "Karnal", "Panipat", "Kurukshetra", "Sonipat", "Rohtak"];

const recentBroadcasts = [
    {
        id: "BC-001",
        type: "disease" as AlertType,
        title: "Wheat Rust Alert - Kurukshetra",
        message: "Yellow rust outbreak detected. Check your wheat crops and apply fungicide if symptoms appear.",
        districts: ["Kurukshetra", "Karnal"],
        time: "2 hours ago",
        reach: 4521,
    },
    {
        id: "BC-002",
        type: "fake_product" as AlertType,
        title: "Counterfeit Fertilizer Warning",
        message: "Fake NPK bags reported in local markets. Verify products before purchase.",
        districts: ["All Districts"],
        time: "1 day ago",
        reach: 12458,
    },
    {
        id: "BC-003",
        type: "water" as AlertType,
        title: "Canal Water Contamination Notice",
        message: "Elevated iron levels detected. Avoid using for vegetable irrigation.",
        districts: ["Panipat", "Sonipat"],
        time: "2 days ago",
        reach: 3890,
    },
];

export default function Communities() {
    const [selectedType, setSelectedType] = useState<AlertType>("disease");
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>(["All Districts"]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleDistrictToggle = (district: string) => {
        if (district === "All Districts") {
            setSelectedDistricts(["All Districts"]);
        } else {
            const newDistricts = selectedDistricts.filter(d => d !== "All Districts");
            if (newDistricts.includes(district)) {
                setSelectedDistricts(newDistricts.filter(d => d !== district));
            } else {
                setSelectedDistricts([...newDistricts, district]);
            }
        }
    };

    const handleSend = () => {
        toast.success("Broadcast sent successfully!");
        setTitle("");
        setMessage("");
        setSelectedDistricts(["All Districts"]);
    };

    const getAlertIcon = (type: AlertType) => {
        return alertTypes.find(a => a.id === type)?.icon || Radio;
    };

    const getAlertColor = (type: AlertType) => {
        return alertTypes.find(a => a.id === type)?.color || "";
    };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Community Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Broadcast alerts and manage community communications</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Broadcast Composer */}
                    <Card className="border-primary/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Radio className="w-5 h-5 text-primary animate-pulse" />
                                Broadcast Alert
                            </CardTitle>
                            <CardDescription>
                                Send urgent notifications to farmers in specific districts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Alert Type */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Alert Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {alertTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id as AlertType)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium ${selectedType === type.id
                                                    ? type.color + " ring-1 ring-offset-1"
                                                    : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                        >
                                            <type.icon className="w-4 h-4" />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Districts */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Target Districts</label>
                                <div className="flex flex-wrap gap-2">
                                    {districts.map((district) => (
                                        <button
                                            key={district}
                                            onClick={() => handleDistrictToggle(district)}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-all border ${selectedDistricts.includes(district)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-muted hover:bg-muted/80 text-muted-foreground border-transparent"
                                                }`}
                                        >
                                            {district}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alert Title</label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Heavy Rain Warning"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Clear, actionable message for farmers..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            {/* Preview */}
                            <div className="p-4 rounded-xl bg-muted/50 border border-border">
                                <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">Message Preview</p>
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getAlertColor(selectedType)}`}>
                                        {(() => {
                                            const Icon = getAlertIcon(selectedType);
                                            return <Icon className="w-5 h-5" />;
                                        })()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground text-sm">{title || "Alert Title"}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{message || "Alert message will appear here..."}</p>
                                        <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            To: {selectedDistricts.join(", ")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full gap-2"
                                size="lg"
                                disabled={!title || !message}
                                onClick={handleSend}
                            >
                                <Send className="w-5 h-5" />
                                Broadcast Alert
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Broadcasts */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            Recent Broadcasts
                        </h3>

                        {recentBroadcasts.map((broadcast) => {
                            const Icon = getAlertIcon(broadcast.type);
                            const colorClass = getAlertColor(broadcast.type);

                            return (
                                <Card key={broadcast.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-mono text-muted-foreground">{broadcast.id}</span>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Sent</Badge>
                                            </div>
                                            <h4 className="font-semibold text-foreground truncate">{broadcast.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{broadcast.message}</p>

                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {broadcast.districts.join(", ")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {broadcast.reach.toLocaleString()} reached
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {broadcast.time}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
