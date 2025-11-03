import React, { useState, useEffect } from 'react';
import { Salesman } from '../../types';

interface AddSalesmanPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    salesman: Salesman | null;
    onRecordPayment: (salesmanId: number, amount: number, date: string) => void;
}

const AddSalesmanPaymentModal: React.FC<AddSalesmanPaymentModalProps> = ({ isOpen, onClose, salesman, onRecordPayment }) => {
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Reset form when modal opens
        if (isOpen) {
            setAmount(0);
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (salesman && amount > 0) {
            onRecordPayment(salesman.id, amount, date);
        }
    };

    if (!isOpen || !salesman) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Record Payment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <p className="text-brand-text-secondary mb-6">To: <span className="font-semibold text-brand-blue">{salesman.name}</span></p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="payment-date" className="block text-sm font-medium text-brand-text-secondary">Payment Date</label>
                        <input 
                            type="date" 
                            id="payment-date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>

                    <div>
                        <label htmlFor="payment-amount" className="block text-sm font-medium text-brand-text-secondary">Amount Paid (PKR)</label>
                        <input 
                            type="number" 
                            id="payment-amount" 
                            value={amount} 
                            onChange={e => setAmount(Number(e.target.value))} 
                            required 
                            min="1"
                            placeholder="Enter amount"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Record Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSalesmanPaymentModal;
