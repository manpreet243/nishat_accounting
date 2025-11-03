import React from 'react';
import { InventoryItem, StockAdjustment } from '../../types';
import { PackageIcon } from '../icons/PackageIcon';

interface InventoryItemDetailProps {
    item: InventoryItem;
    history: StockAdjustment[];
    onBack: () => void;
}

const InventoryItemDetail: React.FC<InventoryItemDetailProps> = ({ item, history, onBack }) => {

    return (
        <div className="bg-brand-surface rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center text-brand-blue">
                         <PackageIcon className="h-8 w-8 mr-3" />
                         <h1 className="text-3xl font-bold">{item.name}</h1>
                    </div>
                    <p className="text-brand-text-secondary">Category: {item.category}</p>
                </div>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">
                    &larr; Back to Inventory
                </button>
            </div>

            {/* Item Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center bg-gray-50 p-4 rounded-lg">
                <div>
                    <p className="text-sm text-brand-text-secondary">Current Stock</p>
                    <p className={`text-2xl font-semibold ${item.stock < item.lowStockThreshold ? 'text-red-500' : 'text-brand-text-primary'}`}>
                        {item.stock}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-brand-text-secondary">Low Stock Threshold</p>
                    <p className="text-2xl font-semibold text-brand-text-primary">{item.lowStockThreshold}</p>
                </div>
                <div>
                    <p className="text-sm text-brand-text-secondary">Status</p>
                    <p className="text-lg font-semibold">
                         {item.stock < item.lowStockThreshold ? (
                            <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Low Stock</span>
                        ) : (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">In Stock</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Adjustment History Table */}
            <div>
                <h3 className="text-xl font-bold text-brand-text-primary mb-4">Adjustment History</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left text-brand-text-secondary">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Quantity Change</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Adjusted By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((adj) => (
                                    <tr key={adj.id} className="bg-white border-b last:border-0">
                                        <td className="px-6 py-4">{new Date(adj.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                        <td className={`px-6 py-4 font-semibold ${adj.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {adj.quantityChange > 0 ? `+${adj.quantityChange}` : adj.quantityChange}
                                        </td>
                                        <td className="px-6 py-4">{adj.reason}</td>
                                        <td className="px-6 py-4">{adj.adjustedBy}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 px-6">
                                        No adjustment history found for this item.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryItemDetail;