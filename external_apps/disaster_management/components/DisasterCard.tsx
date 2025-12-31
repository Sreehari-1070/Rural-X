"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    title: string;
    icon: string;
    disabled?: boolean;
    onClick: () => void;
    selected?: boolean;
}

export default function DisasterCard({ title, icon, disabled, onClick, selected }: Props) {
    return (
        <motion.div
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={!disabled ? onClick : undefined}
            className={`
        flex flex-col items-center justify-center text-center
        p-8 h-64 rounded-2xl border-2 transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' :
                    selected ? 'border-green-600 bg-green-50 shadow-xl ring-2 ring-green-200' : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-lg cursor-pointer'}
      `}
        >
            <span className="text-6xl mb-6">{icon}</span>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            {disabled && <span className="text-sm text-gray-500 font-semibold mt-3 bg-gray-200 px-3 py-1 rounded-full">Coming Soon</span>}
        </motion.div>
    );
}
