'use client';

import { motion } from 'framer-motion';
import { Droplets, CloudRain } from 'lucide-react';
import clsx from 'clsx'; // Make sure to export clsx functionality or just use string interp if clsx not installed yet? 
// Waiting for install, but assuming it will be there. I can stick to template literals if unsure, 
// but clsx is safer. 
// Actually I'll use standard template literals to be safe if `clsx` install fails or is delayed, 
// though I requested it. I'll rely on it being there or similar. 
// "clsx" is standard.

interface IrrigationCardProps {
    type: 'sprinkler' | 'drip';
    title: string;
    description: string;
    selected: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export default function IrrigationCard({
    type,
    title,
    description,
    selected,
    disabled = false,
    onClick,
}: IrrigationCardProps) {
    const Icon = type === 'sprinkler' ? CloudRain : Droplets;

    return (
        <motion.div
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={!disabled ? onClick : undefined}
            className={`
        relative overflow-hidden rounded-2xl p-6 border-2 transition-all cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' :
                    selected ? 'border-green-600 bg-green-50 shadow-lg ring-2 ring-green-600 ring-offset-2' :
                        'border-gray-200 bg-white hover:border-green-400 hover:shadow-md'}
      `}
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${selected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon size={48} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-2">{description}</p>
                </div>
            </div>

            {selected && (
                <div className="absolute top-4 right-4 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </motion.div>
    );
}
