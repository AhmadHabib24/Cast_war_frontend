'use client';

import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onCancel}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm transform scale-100 transition-all border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-black text-[var(--color-brand-black)] mb-2">{title}</h3>
                <p className="text-sm font-medium text-[var(--color-muted-text)] mb-6 leading-relaxed">
                    {message}
                </p>
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-transform transform active:scale-95 ${
                            isDestructive 
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                            : 'bg-[var(--color-brand-black)] hover:bg-[var(--color-deep-black)] text-[var(--color-metallic-gold)] shadow-black/20'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
