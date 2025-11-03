import React, { useState } from 'react';
import { SaleRecord, Salesman } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface DailySalesProps {
    sales: SaleRecord[];
    salesmen: Salesman[];
    onAddCounterSale: () => void;
    onEditSale: (sale: SaleRecord) => void;
    onDeleteSale: (sale: SaleRecord) => void;
}

const DailySales: React.FC<DailySalesProps> = ({ sales, salesmen, onAddCounterSale, onEditSale, onDeleteSale }) => {
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    const filteredSales = sales
        .filter(sale => sale.date === filterDate)
        .sort((a, b) => b.id - a.id);

    const getSalesmanName = (salesmanId?: number) => {
        if (!salesmanId) return 'N/A';
        return salesmen.find(s => s.id === salesmanId)?.name || 'Unknown';
    };

    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200">
                <div>
                    <h2 className="text-xl font-bold text-brand-text-primary">Daily Sales Record</h2>
                    <p className="text-sm text-brand-text-secondary mt-1">Showing sales for the selected date.</p>
                </div>
                <div className="flex items-center gap-4">
                     <input 
                        type="date" 
                        value={filterDate} 
                        onChange={e => setFilterDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                     />
                    <button
                        onClick={onAddCounterSale}
                        className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Counter Sale
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Customer Name</th>
                            <th scope="col" className="px-6 py-3">Bottles Sold</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Amount (PKR)</th>
                            <th scope="col" className="px-6 py-3">Salesman</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.length > 0 ? (
                            filteredSales.map((sale) => (
                                <tr key={sale.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-brand-text-primary">
                                        {sale.customerName}
                                        {sale.isCounterSale && <span className="ml-2 text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">Counter</span>}
                                    </td>
                                    <td className="px-6 py-4">{sale.bottlesSold > 0 ? sale.bottlesSold : 'N/A'}</td>
                                    <td className="px-6 py-4">{sale.bottleCategory || 'N/A'}</td>
                                    <td className="px-6 py-4 font-semibold">{sale.amountReceived.toLocaleString()}</td>
                                    <td className="px-6 py-4">{getSalesmanName(sale.salesmanId)}</td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button onClick={() => onEditSale(sale)} title="Edit Sale" className="text-brand-blue hover:text-brand-lightblue">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                         <button onClick={() => onDeleteSale(sale)} title="Delete Sale" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No sales recorded for this date.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailySales;
