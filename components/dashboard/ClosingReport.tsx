import React, { useState, useMemo } from 'react';
import { SaleRecord, Expense, MonthlyClosing } from '../../types';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { FileTextIcon } from '../icons/FileTextIcon';

interface ClosingReportProps {
    sales: SaleRecord[];
    expenses: Expense[];
    monthlyClosings: MonthlyClosing[];
    onCloseMonth?: (startIso: string, endIso: string) => void;
}

type FilterType = 'today' | 'month' | 'year' | 'custom';

const ClosingReport: React.FC<ClosingReportProps> = ({ sales, expenses, monthlyClosings, onCloseMonth }) => {
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

    const filteredData = useMemo(() => {
        const { start, end } = dateRange;
        
        const filteredSales = sales.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= start && saleDate <= end;
        });

        const filteredExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= start && expenseDate <= end;
        });

        const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amountReceived, 0);
        const counterSaleRevenue = filteredSales.filter(s => s.isCounterSale).reduce((sum, s) => sum + s.amountReceived, 0);
        const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        
            // Calculate payment method specific totals
            const totalCashRevenue = filteredSales.reduce((sum, s) => sum + (s.paymentMethod === 'bank' ? 0 : s.amountReceived), 0);
            const totalBankRevenue = filteredSales.reduce((sum, s) => sum + (s.paymentMethod === 'bank' ? s.amountReceived : 0), 0);
            const totalCashExpenses = filteredExpenses.reduce((sum, e) => sum + (e.paymentAccount === 'bank' ? 0 : e.amount), 0);
            const totalBankExpenses = filteredExpenses.reduce((sum, e) => sum + (e.paymentAccount === 'bank' ? e.amount : 0), 0);
            const netCash = (totalCashRevenue + totalBankRevenue) - (totalCashExpenses + totalBankExpenses);

        return {
            filteredSales,
            filteredExpenses,
            totalRevenue,
            counterSaleRevenue,
            totalExpenses,
                netCash,
                totalCashRevenue,
                totalBankRevenue,
                totalCashExpenses,
                totalBankExpenses
        };
    }, [sales, expenses, dateRange]);

    const handlePrint = () => {
        window.print();
    };

    const getFilterLabel = () => {
        switch(filterType) {
            case 'today': return 'Today';
            case 'month': return 'This Month';
            case 'year': return 'This Year';
            case 'custom': 
                if (customStartDate && customEndDate) {
                    return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
                }
                return 'Custom Range';
            default: return 'Report';
        }
    };

    return (
        <div>
            <div className="no-print flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Closing Report</h1>
                 <div className="flex items-center gap-2 flex-wrap">
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
                    <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">
                        <FileTextIcon className="h-5 w-5 mr-2"/> Print Report
                    </button>
                    {filterType === 'month' && onCloseMonth && (
                        <button onClick={() => {
                            const confirmClose = confirm('This will archive the selected month and remove those sales & expenses from active data. This action is manual and irreversible. Proceed?');
                            if (!confirmClose) return;
                            const today = new Date();
                            const start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                            const end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                            onCloseMonth(start, end);
                        }} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Close Month
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-brand-surface rounded-xl shadow-md p-6 printable-area">
                <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Closing Report</h2>
                    <p className="text-brand-text-secondary">For Period: {getFilterLabel()}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-green-800 font-semibold">CASH REVENUE</p>
                            <p className="text-2xl font-bold text-green-600">PKR {filteredData.totalCashRevenue.toLocaleString()}</p>
                    </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-yellow-800 font-semibold">BANK REVENUE</p>
                            <p className="text-2xl font-bold text-yellow-600">PKR {filteredData.totalBankRevenue.toLocaleString()}</p>
                    </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-orange-800 font-semibold">EXPENSES</p>
                            <p className="text-lg text-orange-600">Cash: PKR {filteredData.totalCashExpenses.toLocaleString()}</p>
                            <p className="text-lg text-orange-600">Bank: PKR {filteredData.totalBankExpenses.toLocaleString()}</p>
                    </div>
                     <div className="bg-indigo-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-indigo-800 font-semibold">NET CASH FLOW</p>
                            <p className={`text-lg font-bold ${filteredData.netCash >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>PKR {filteredData.netCash.toLocaleString()}</p>
                            <p className="text-xs text-gray-600 mt-1">Total Revenue: PKR {filteredData.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Total Expenses: PKR {filteredData.totalExpenses.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center">
                           <DollarSignIcon className="h-5 w-5 mr-2 text-green-500" /> Sales Details ({filteredData.filteredSales.length})
                        </h3>
                        <div className="border rounded-lg overflow-auto max-h-96">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Customer</th>
                                        <th className="px-4 py-2 text-right">Amount (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredData.filteredSales.length > 0 ? filteredData.filteredSales.map(s => (
                                        <tr key={s.id}>
                                            <td className="px-4 py-2">{s.customerName}</td>
                                            <td className="px-4 py-2 text-right font-medium">{s.amountReceived.toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={2} className="text-center p-4 text-gray-500">No sales in this period.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center">
                            <CreditCardIcon className="h-5 w-5 mr-2 text-red-500" /> Expense Details ({filteredData.filteredExpenses.length})
                        </h3>
                         <div className="border rounded-lg overflow-auto max-h-96">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Description</th>
                                        <th className="px-4 py-2 text-right">Amount (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredData.filteredExpenses.length > 0 ? filteredData.filteredExpenses.map(e => (
                                        <tr key={e.id}>
                                            <td className="px-4 py-2">{e.description}</td>
                                            <td className="px-4 py-2 text-right font-medium">{e.amount.toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={2} className="text-center p-4 text-gray-500">No expenses in this period.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                    {/* Historical Monthly Closings */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Historical Monthly Closings</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Period</th>
                                        <th className="px-4 py-2 text-right">Cash Revenue</th>
                                        <th className="px-4 py-2 text-right">Bank Revenue</th>
                                        <th className="px-4 py-2 text-right">Cash Expenses</th>
                                        <th className="px-4 py-2 text-right">Bank Expenses</th>
                                        <th className="px-4 py-2 text-right">Net Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {monthlyClosings.length > 0 ? (
                                        monthlyClosings.map(mc => (
                                            <tr key={mc.id}>
                                                <td className="px-4 py-2">{new Date(mc.periodStart).toLocaleDateString()} - {new Date(mc.periodEnd).toLocaleDateString()}</td>
                                                <td className="px-4 py-2 text-right">PKR {mc.totalCashRevenue.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-right">PKR {mc.totalBankRevenue.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-right">PKR {mc.totalCashExpenses.toLocaleString()}</td>
                                                <td className="px-4 py-2 text-right">PKR {mc.totalBankExpenses.toLocaleString()}</td>
                                                <td className={`px-4 py-2 text-right font-medium ${mc.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    PKR {mc.netBalance.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-4 text-center text-gray-500">No historical data available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default ClosingReport;