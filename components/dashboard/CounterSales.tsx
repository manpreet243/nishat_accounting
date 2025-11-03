import React, { useState, useMemo } from 'react';
import { SaleRecord } from '../../types';
import { DollarSignIcon } from '../icons/DollarSignIcon';

interface CounterSalesProps {
    sales: SaleRecord[];
}

type FilterType = 'today' | 'month' | 'year' | 'custom';

const CounterSales: React.FC<CounterSalesProps> = ({ sales }) => {
    const [filterType, setFilterType] = useState<FilterType>('today');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const dateRange = useMemo(() => {
        const today = new Date();
        const startOfDay = (date: Date) => new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = (date: Date) => new Date(date.setHours(23, 59, 59, 999));
        
        let start = new Date();
        let end = new Date();

        switch(filterType) {
            case 'today':
                start = startOfDay(today);
                end = endOfDay(today);
                break;
            case 'month':
                start = startOfDay(new Date(today.getFullYear(), today.getMonth(), 1));
                end = endOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case 'year':
                start = startOfDay(new Date(today.getFullYear(), 0, 1));
                end = endOfDay(new Date(today.getFullYear(), 11, 31));
                break;
            case 'custom':
                start = customStartDate ? startOfDay(new Date(customStartDate)) : startOfDay(new Date('1970-01-01'));
                end = customEndDate ? endOfDay(new Date(customEndDate)) : endOfDay(new Date());
                break;
        }
        return { start, end };
    }, [filterType, customStartDate, customEndDate]);

    const filtered = useMemo(() => {
        const { start, end } = dateRange;
        const filteredSales = sales.filter(s => s.isCounterSale).filter(s => {
            const d = new Date(s.date);
            return d >= start && d <= end;
        });
        const total = filteredSales.reduce((sum, s) => sum + s.amountReceived, 0);
        return { filteredSales, total };
    }, [sales, dateRange]);

    const getFilterLabel = () => {
        switch(filterType) {
            case 'today': return 'Today';
            case 'month': return 'This Month';
            case 'year': return 'This Year';
            case 'custom': 
                if (customStartDate && customEndDate) return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`;
                return 'Custom Range';
            default: return 'Counter Sales';
        }
    };

    return (
        <div>
            <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Counter Sales</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setFilterType('today')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'today' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>Today</button>
                    <button onClick={() => setFilterType('month')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'month' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>This Month</button>
                    <button onClick={() => setFilterType('year')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'year' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>This Year</button>
                    <button onClick={() => setFilterType('custom')} className={`px-3 py-1 text-sm rounded-full ${filterType === 'custom' ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>Custom</button>
                    {filterType === 'custom' && (
                        <div className="flex gap-2">
                             <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="px-2 py-1 text-sm border rounded"/>
                             <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="px-2 py-1 text-sm border rounded"/>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-brand-surface rounded-xl shadow-md p-6">
                <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Counter Sales Report</h2>
                    <p className="text-brand-text-secondary">For Period: {getFilterLabel()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-blue-800 font-semibold">COUNTER SALES TOTAL</p>
                        <p className="text-2xl font-bold text-blue-600">PKR {filtered.total.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-800 font-semibold">NUMBER OF SALES</p>
                        <p className="text-2xl font-bold text-gray-700">{filtered.filteredSales.length}</p>
                    </div>
                </div>

                <div className="border rounded-lg overflow-auto max-h-96">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-right">Amount (PKR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.filteredSales.length > 0 ? filtered.filteredSales.map(s => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2">{new Date(s.date).toLocaleString()}</td>
                                    <td className="px-4 py-2">{s.description || '—'}</td>
                                    <td className="px-4 py-2 text-right font-medium">{s.amountReceived.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={3} className="text-center p-4 text-gray-500">No counter sales in this period.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CounterSales;
