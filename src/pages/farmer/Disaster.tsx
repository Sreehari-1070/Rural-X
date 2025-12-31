import FarmerLayout from '@/components/layout/FarmerLayout';
import { ExternalAppWrapper } from '@/components/shared/ExternalAppWrapper';

export default function DisasterManagement() {
  return (
    <FarmerLayout>
      <div className="flex flex-col w-full gap-4">
        <div className="shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Disaster Management System</h1>
          <p className="text-sm md:text-base text-text-secondary">Real-time disaster alerts and drainage planning for flood mitigation.</p>
        </div>
        <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-sm h-[100vh]">
          <ExternalAppWrapper
            src={import.meta.env.VITE_DISASTER_URL || "http://localhost:3002"}
            title="Disaster Management Dashboard"
          />
        </div>
      </div>
    </FarmerLayout>
  );
}
