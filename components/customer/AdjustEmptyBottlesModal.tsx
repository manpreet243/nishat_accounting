// Implemented the AdjustEmptyBottlesModal component.
import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';

interface AdjustEmptyBottlesModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    onSave: (customerId: number, newEmptyBottleCount: number) => void;
}

const AdjustEmptyBottlesModal: React.FC<AdjustEmptyBottlesModalProps> = ({ isOpen, onClose, customer, onSave }) => {
    const [emptyBottles, setEmptyBottles] = useState(0);

    useEffect(() => {
        if (customer) {
            setEmptyBottles(customer.emptyBottlesOnHand || 0);
        }
    }, [customer, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
            onSave(customer.id, emptyBottles);
        }
        onClose();
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Adjust Empty Bottles</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <p className="text-brand-text-secondary mb-6">For: <span className="font-semibold text-brand-blue">{customer.name}</span></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="empty-bottles" className="block text-sm font-medium text-brand-text-secondary">Empty Bottles Returned (On Hand)</label>
                        <input
                            type="number"
                            id="empty-bottles"
                            value={emptyBottles}
                            onChange={(e) => setEmptyBottles(Number(e.target.value))}
                            required
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        />
                         <p className="mt-2 text-xs text-brand-text-secondary">This is the total number of empty bottles the customer currently has.</p>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdjustEmptyBottlesModal;
