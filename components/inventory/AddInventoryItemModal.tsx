import React, { useState } from 'react';
import { InventoryItem } from '../../types';

interface AddInventoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
}

const AddInventoryItemModal: React.FC<AddInventoryItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(20);
    const [sellPrice, setSellPrice] = useState<number | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: Omit<InventoryItem, 'id'> = {
            name,
            category,
            stock,
            lowStockThreshold,
            sellPrice: typeof sellPrice === 'number' ? sellPrice : undefined,
        };
        onAddItem(newItem);
        // Reset form
    setName('');
    setCategory('');
    setStock(0);
    setLowStockThreshold(20);
    setSellPrice('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Add New Inventory Item</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="item-name" className="block text-sm font-medium text-brand-text-secondary">Item Name</label>
                        <input type="text" id="item-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="item-category" className="block text-sm font-medium text-brand-text-secondary">Category</label>
                        <input type="text" id="item-category" value={category} placeholder="e.g., Filters, Piping" onChange={e => setCategory(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="item-stock" className="block text-sm font-medium text-brand-text-secondary">Initial Stock</label>
                        <input type="number" id="item-stock" value={stock} onChange={e => setStock(Number(e.target.value))} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="item-threshold" className="block text-sm font-medium text-brand-text-secondary">Low Stock Threshold</label>
                        <input type="number" id="item-threshold" value={lowStockThreshold} onChange={e => setLowStockThreshold(Number(e.target.value))} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="item-sellprice" className="block text-sm font-medium text-brand-text-secondary">Sell Price (PKR)</label>
                        <input type="number" id="item-sellprice" value={sellPrice as any} onChange={e => setSellPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 120" min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Add Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInventoryItemModal;