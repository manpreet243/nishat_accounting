import React, { useMemo } from 'react';
import { Salesman, SaleRecord, SalesmanPayment, Customer } from '../../types';
import { FileTextIcon } from '../icons/FileTextIcon';
import { TruckIcon } from '../icons/TruckIcon';

interface SalesmanReportProps {
    salesman: Salesman;
    salesRecords: SaleRecord[];
    salesmanPayments: SalesmanPayment[];
    customers: Customer[];
    onBack: () => void;
}

const SalesmanReport: React.FC<SalesmanReportProps> = ({ salesman, salesRecords, salesmanPayments, customers, onBack }) => {

    const todayStr = new Date().toISOString().split('T')[0];

    const todaySales = useMemo(() => {
        return salesRecords.filter(s => s.salesmanId === salesman.id && s.date === todayStr);
    }, [salesRecords, salesman.id, todayStr]);
    
    const paymentHistory = useMemo(() => {
        return salesmanPayments
            .filter(p => p.salesmanId === salesman.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [salesmanPayments, salesman.id]);

    const assignedCustomers = useMemo(() => {
        return customers.filter(c => c.salesmanId === salesman.id);
    }, [customers, salesman.id]);

    const stats = useMemo(() => {
        const bottlesSold = todaySales.reduce((sum, s) => sum + s.bottlesSold, 0);
        const totalRevenue = todaySales.reduce((sum, s) => sum + s.amountReceived, 0);
        const totalPaid = paymentHistory.reduce((sum, p) => sum + p.amount, 0);
        
        const totalRevenueAllTime = salesRecords
            .filter(s => s.salesmanId === salesman.id)
            .reduce((sum, s) => sum + s.amountReceived, 0);
        
        const netBalanceAllTime = totalRevenueAllTime - totalPaid;


        return { bottlesSold, totalRevenue, totalPaid, netBalance: netBalanceAllTime };
    }, [todaySales, paymentHistory, salesRecords, salesman.id]);

    const handlePrint = () => {
        window.print();
    };
    
    const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div>
            <div className="flex justify-between items-start mb-6 no-print">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary">Salesman Daily Report</h1>
                    <p className="text-brand-text-secondary">Report for {salesman.name} on {formattedDate}</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">
                        &larr; Back to List
                    </button>
                    <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">
                        <FileTextIcon className="h-5 w-5 mr-2"/>
                        Print Pay Slip
                    </button>
                </div>
            </div>
            
            <div className="bg-brand-surface rounded-xl shadow-md p-6 printable-area">
                <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Salesman Pay Slip & Report</h2>
                    <p className="text-brand-text-secondary">Nishat Beverages</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-brand-text-secondary">Salesman Name</p>
                        <p className="font-bold text-lg text-brand-text-primary">{salesman.name}</p>
                    </div>
                     <div>
                        <p className="text-sm text-brand-text-secondary">Date</p>
                        <p className="font-bold text-lg text-brand-text-primary">{formattedDate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p className="text-sm text-brand-text-secondary">Today's Bottles Sold</p>
                        <p className="text-2xl font-semibold text-brand-text-primary">{stats.bottlesSold}</p>
                    </div>
                    <div>
                        <p className="text-sm text-brand-text-secondary">Today's Revenue</p>
                        <p className="text-2xl font-semibold text-green-600">PKR {stats.totalRevenue.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-brand-text-secondary">Total Paid</p>
                        <p className="text-2xl font-semibold text-red-600">PKR {stats.totalPaid.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-brand-text-secondary">Net Balance</p>
                        <p className={`text-2xl font-semibold ${stats.netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            PKR {stats.netBalance.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Assigned Customers Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center"><TruckIcon className="h-5 w-5 mr-2" /> Assigned Customers for Delivery</h3>
                     <div className="overflow-x-auto border rounded-lg max-h-60">
                        <table className="w-full text-sm text-left text-brand-text-secondary">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Customer</th>
                                    <th scope="col" className="px-6 py-3">Address</th>
                                    <th scope="col" className="px-6 py-3">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {assignedCustomers.length > 0 ? (
                                    assignedCustomers.map((customer) => (
                                        <tr key={customer.id} className="bg-white">
                                            <td className="px-6 py-3 font-semibold">{customer.name}</td>
                                            <td className="px-6 py-3">{`H: ${customer.houseNumber}, F: ${customer.floor}, Flat: ${customer.flat}`}</td>
                                            <td className="px-6 py-3">{customer.mobile}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 px-6">
                                            No customers are assigned to this salesman.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Sales Details for Today</h3>
                        <div className="overflow-x-auto border rounded-lg max-h-60">
                            <table className="w-full text-sm text-left text-brand-text-secondary">
                                <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50 sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Customer</th>
                                        <th scope="col" className="px-6 py-3">Amount (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {todaySales.length > 0 ? (
                                        todaySales.map((sale) => (
                                            <tr key={sale.id} className="bg-white">
                                                <td className="px-6 py-3">{sale.customerName}</td>
                                                <td className="px-6 py-3 font-semibold">{sale.amountReceived.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-center py-10 px-6">
                                                No sales recorded for this salesman today.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Payment History</h3>
                        <div className="overflow-x-auto border rounded-lg max-h-60">
                            <table className="w-full text-sm text-left text-brand-text-secondary">
                                <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50 sticky top-0">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Amount Paid (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {paymentHistory.length > 0 ? (
                                        paymentHistory.map((payment) => (
                                            <tr key={payment.id} className="bg-white">
                                                <td className="px-6 py-3">{new Date(payment.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                                <td className="px-6 py-3 font-semibold">{payment.amount.toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-center py-10 px-6">
                                                No payment history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanReport;