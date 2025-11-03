import React, { useState, useEffect } from 'react';

interface AddCounterSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecordSale: (amountPaid: number, description: string) => void;
}

const AddCounterSaleModal: React.FC<AddCounterSaleModalProps> = ({ isOpen, onClose, onRecordSale }) => {
    const [amountPaid, setAmountPaid] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if(isOpen) {
            setAmountPaid(0);
            setDescription('');
        }
    }, [isOpen]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRecordSale(amountPaid, description);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Record Counter Sale</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="counter-amountPaid" className="block text-sm font-medium text-brand-text-secondary">Amount Paid (PKR)</label>
                        <input 
                            type="number" 
                            id="counter-amountPaid" 
                            value={amountPaid} 
                            onChange={e => setAmountPaid(Number(e.target.value))} 
                            required 
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>
                     <div>
                        <label htmlFor="counter-description" className="block text-sm font-medium text-brand-text-secondary">Description (Optional)</label>
                        <input 
                            type="text" 
                            id="counter-description" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="e.g., Filter change, 3 small bottles"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>
                    
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Record Sale</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCounterSaleModal;