import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';

interface EditInventoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onUpdateItem: (item: InventoryItem) => void;
}

const EditInventoryItemModal: React.FC<EditInventoryItemModalProps> = ({ isOpen, onClose, item, onUpdateItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(20);
    const [sellPrice, setSellPrice] = useState<number | ''>('');

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategory(item.category);
            setLowStockThreshold(item.lowStockThreshold);
            setSellPrice(typeof item.sellPrice === 'number' ? item.sellPrice : '');
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item) {
            onUpdateItem({
                ...item,
                name,
                category,
                lowStockThreshold,
                sellPrice: typeof sellPrice === 'number' ? sellPrice : undefined,
            });
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Edit Inventory Item</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-item-name" className="block text-sm font-medium text-brand-text-secondary">Item Name</label>
                        <input type="text" id="edit-item-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-item-category" className="block text-sm font-medium text-brand-text-secondary">Category</label>
                        <input type="text" id="edit-item-category" value={category} onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="edit-item-threshold" className="block text-sm font-medium text-brand-text-secondary">Low Stock Threshold</label>
                        <input type="number" id="edit-item-threshold" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-item-sellprice" className="block text-sm font-medium text-brand-text-secondary">Sell Price (PKR)</label>
                        <input type="number" id="edit-item-sellprice" value={sellPrice as any} onChange={e => setSellPrice(e.target.value === '' ? '' : Number(e.target.value))} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Update Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInventoryItemModal;