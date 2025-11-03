
import React from 'react';
import { Customer, SaleRecord, Expense } from '../../types';
import StatCard from './StatCard';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { BellIcon } from '../icons/BellIcon';

interface DashboardProps {
    customers: Customer[];
    sales: SaleRecord[];
    expenses: Expense[];
    onNavigate: (view: 'customers' | 'sales' | 'expenses' | 'reminders') => void;
    onViewCustomer: (customer: Customer) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ customers, sales, expenses, onNavigate, onViewCustomer }) => {
    
    const today = new Date().toISOString().split('T')[0];
    
    const todaysSales = sales.filter(s => s.date === today);
    const totalRevenueToday = todaysSales.reduce((sum, sale) => sum + sale.amountReceived, 0);
    
    const totalPendingBalance = customers.reduce((sum, customer) => sum + customer.totalBalance, 0);
    
    const deliveriesDueToday = customers.filter(c => c.deliveryDueToday).length;

    const customersToDisplay = customers
        .filter(c => c.deliveryDueToday || c.totalBalance > 0)
        .sort((a, b) => {
            if (a.deliveryDueToday && !b.deliveryDueToday) return -1;
            if (!a.deliveryDueToday && b.deliveryDueToday) return 1;
            return b.totalBalance - a.totalBalance;
        })
        .slice(0, 5);


    return (
        <div>
            {/* <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Dashboard Overview</h1> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Today's Revenue" 
                    value={`PKR ${totalRevenueToday.toLocaleString()}`} 
                    icon={<DollarSignIcon />} 
                    color="text-green-500"
                />
                <StatCard 
                    title="Total Clients" 
                    value={customers.length.toString()} 
                    icon={<UsersIcon />}
                />
                <StatCard 
                    title="Total Pending Balance" 
                    value={`PKR ${totalPendingBalance.toLocaleString()}`} 
                    icon={<CreditCardIcon />}
                    color="text-yellow-500"
                />
                 <StatCard 
                    title="Deliveries Due Today" 
                    value={deliveriesDueToday.toString()} 
                    icon={<BellIcon />}
                    color="text-red-500"
                />
            </div>
            
            <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text-primary">Priority Customers</h2>
                        <p className="text-sm text-brand-text-secondary mt-1">Customers with pending balances or deliveries due today.</p>
                    </div>
                    <button onClick={() => onNavigate('customers')} className="text-sm font-medium text-brand-blue hover:underline">
                        View All Customers
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-brand-text-secondary">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Customer</th>
                                <th scope="col" className="px-6 py-3">Balance (PKR)</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customersToDisplay.length > 0 ? (
                                customersToDisplay.map((customer) => (
                                    <tr key={customer.id} className={`border-b ${customer.deliveryDueToday ? 'bg-red-50' : 'bg-white'}`}>
                                        <td className="px-6 py-4 font-medium text-brand-text-primary">
                                            {customer.name}
                                            {customer.deliveryDueToday && <span className="ml-2 text-xs font-semibold text-red-700 bg-red-200 px-2 py-0.5 rounded-full">Due Today</span>}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">{customer.totalBalance.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            {customer.totalBalance > 0 ? (
                                                <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Paid</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onViewCustomer(customer)} className="font-medium text-blue-600 hover:underline">View Details</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 px-6">
                                        No priority customers at the moment.
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

export default Dashboard;
