import React from 'react';
import { InventoryItem } from '../../types';
import Inventory from './Inventory';

interface StockProps {
    inventory: InventoryItem[];
    onAddItem: () => void;
    onEditItem: (item: InventoryItem) => void;
    onDeleteItem: (item: InventoryItem) => void;
    onAdjustStock: (item: InventoryItem) => void;
    onViewDetails: (item: InventoryItem) => void;
    warehouseStock?: number;
}

// Stock view is a thin wrapper around Inventory but will show two quick sections:
// - Pending items: items with stock === 0 (or below low threshold)
// - Ready to sell: items with stock >= lowStockThreshold

const Stock: React.FC<StockProps> = ({ inventory, onAddItem, onEditItem, onDeleteItem, onAdjustStock, onViewDetails, warehouseStock }) => {
    const pending = inventory.filter(i => i.stock === 0 || i.stock < i.lowStockThreshold).length;
    const ready = inventory.filter(i => i.stock >= i.lowStockThreshold).length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-text-primary">Stock</h1>
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Warehouse Pool</div>
                        <div className="text-lg font-bold">{warehouseStock ?? 0}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Pending Items</div>
                        <div className="text-lg font-bold">{pending}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-500">Ready to Sell</div>
                        <div className="text-lg font-bold">{ready}</div>
                    </div>
                </div>
            </div>

            <Inventory inventory={inventory} onAddItem={onAddItem} onEditItem={onEditItem} onDeleteItem={onDeleteItem} onAdjustStock={onAdjustStock} onViewDetails={onViewDetails} />
        </div>
    );
};

export default Stock;
