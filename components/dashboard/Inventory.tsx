import React from 'react';
import { InventoryItem } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { PackageIcon } from '../icons/PackageIcon';

interface InventoryProps {
    inventory: InventoryItem[];
    onAddItem: () => void;
    onEditItem: (item: InventoryItem) => void;
    onDeleteItem: (item: InventoryItem) => void;
    onAdjustStock: (item: InventoryItem) => void;
    onViewDetails: (item: InventoryItem) => void;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onAddItem, onEditItem, onDeleteItem, onAdjustStock, onViewDetails }) => {
    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">Inventory Management</h2>
                <button
                    onClick={onAddItem}
                    className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Item
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Item Name</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Current Stock</th>
                            <th scope="col" className="px-6 py-3">Low Stock Threshold</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.length > 0 ? (
                            inventory.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-brand-text-primary">{item.name}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className={`px-6 py-4 font-semibold ${item.stock === 0 ? 'text-gray-500' : item.stock < item.lowStockThreshold ? 'text-red-500' : 'text-brand-text-primary'}`}>
                                        {item.stock}
                                    </td>
                                    <td className="px-6 py-4">{item.lowStockThreshold}</td>
                                    <td className="px-6 py-4">
                                        {item.stock === 0 ? (
                                            <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-200 rounded-full">Out of Stock</span>
                                        ) : item.stock < item.lowStockThreshold ? (
                                            <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Low Stock</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">In Stock</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button onClick={() => onViewDetails(item)} className="font-medium text-blue-600 hover:underline">Details</button>
                                        <button onClick={() => onEditItem(item)} title="Edit Item" className="text-brand-blue hover:text-brand-lightblue">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onAdjustStock(item)} title="Adjust Stock" className="text-green-600 hover:text-green-800">
                                            <PackageIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onDeleteItem(item)} title="Delete Item" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No inventory items found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;