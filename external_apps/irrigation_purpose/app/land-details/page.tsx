'use client';

import LandForm from '@/components/LandForm';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LandDetailsPage() {
    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-6 left-6">
                <Link href="/select-irrigation" className="flex items-center text-green-700 hover:text-green-900 transition-colors gap-2">
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Enter Land Dimensions
                </h1>
                <p className="text-gray-600">
                    Provide the measurements of your agricultural field in meters.
                </p>
            </motion.div>

            <LandForm />
        </div>
    );
}
