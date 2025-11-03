import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';

interface AdjustStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onAdjustStock: (itemId: number, newStock: number, quantityChange: number, reason: string) => void;
}

const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ isOpen, onClose, item, onAdjustStock }) => {
    const [newStock, setNewStock] = useState(0);
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (item) {
            setNewStock(item.stock);
            setReason(''); // Reset reason on new item
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            const quantityChange = newStock - item.stock;
            onAdjustStock(item.id, newStock, quantityChange, reason);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Adjust Stock</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <p className="text-brand-text-secondary mb-6">Item: <span className="font-semibold text-brand-blue">{item.name}</span></p>
               
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="stock-level" className="block text-sm font-medium text-brand-text-secondary">New Stock Quantity</label>
                        <input 
                            type="number" 
                            id="stock-level" 
                            value={newStock} 
                            onChange={e => setNewStock(Number(e.target.value))} 
                            required 
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>
                     <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-brand-text-secondary">Reason for Adjustment</label>
                        <input 
                            type="text" 
                            id="reason" 
                            value={reason} 
                            onChange={e => setReason(e.target.value)} 
                            required 
                            placeholder="e.g., Received Shipment, Damaged Goods"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Update Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdjustStockModal;