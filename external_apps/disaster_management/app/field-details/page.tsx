import React from 'react';
import FieldForm from '@/components/FieldForm';

export default function FieldDetails() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
            <div className="max-w-xl w-full text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-3">Field Configuration</h1>
                <p className="text-slate-500 text-lg">Enter detailed parameters to generate an accurate drainage simulation.</p>
            </div>
            <div className="w-full max-w-lg">
                <FieldForm />
            </div>
        </div>
    );
}
