import FarmerLayout from '@/components/layout/FarmerLayout';
import { ExternalAppWrapper } from '@/components/shared/ExternalAppWrapper';

export default function FertilizerTool() {
    return (
        <FarmerLayout>
            <div className="flex flex-col w-full gap-4">
                <div className="shrink-0">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">Fertilizer Ratio Advisor</h1>
                    <p className="text-sm md:text-base text-text-secondary">AI-powered recommendations for optimal fertilizer usage based on your soil data.</p>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-sm h-[100vh]">
                    <ExternalAppWrapper
                        src={import.meta.env.VITE_FERTILIZER_URL || "http://localhost:3000"}
                        title="Fertilizer Ratio Application"
                    />
                </div>
            </div>
        </FarmerLayout>
    );
}
