'use client';

import { useRouter } from 'next/navigation';
import { useIrrigationStore } from '@/store/useIrrigationStore';
import IrrigationCard from '@/components/IrrigationCard';
import { motion } from 'framer-motion';

export default function SelectIrrigationPage() {
    const router = useRouter();
    const { setIrrigationType, irrigationType } = useIrrigationStore();

    const handleSelect = (type: 'sprinkler' | 'drip') => {
        setIrrigationType(type);
        if (type === 'sprinkler') {
            // Small delay for visual feedback if desired, or instant
            router.push('/land-details');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Choose Irrigation Method
                </h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Select the type of irrigation system you want to design for your field.
                </p>
            </motion.div>

            <div className="flex justify-center w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full max-w-md"
                >
                    <IrrigationCard
                        type="sprinkler"
                        title="Sprinkler Irrigation"
                        description="Water is distributed through a system of pipes usually by pumping. Ideal for most crops."
                        selected={irrigationType === 'sprinkler'}
                        onClick={() => handleSelect('sprinkler')}
                    />
                </motion.div>
            </div>
        </div>
    );
}
