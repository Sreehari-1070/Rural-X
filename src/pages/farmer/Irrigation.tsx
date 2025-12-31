import FarmerLayout from '@/components/layout/FarmerLayout';
import { ExternalAppWrapper } from '@/components/shared/ExternalAppWrapper';

export default function IrrigationTool() {
    return (
        <FarmerLayout>
            <div className="flex flex-col w-full gap-4">
                <div className="shrink-0">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">Smart Irrigation Planner</h1>
                    <p className="text-sm md:text-base text-text-secondary">Design and simulate efficient irrigation layouts for your fields.</p>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-sm h-[100vh]">
                    <ExternalAppWrapper
                        src={import.meta.env.VITE_IRRIGATION_URL || "http://localhost:3001"}
                        title="Irrigation Layout Simulator"
                    />
                </div>
            </div>
        </FarmerLayout>
    );
}
