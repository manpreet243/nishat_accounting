
import React from 'react';
import { Salesman, Customer } from '../../types';
import DeliveryList from './DeliveryList';
import { TruckIcon } from '../icons/TruckIcon';
import { LogoutIcon } from '../icons/LogoutIcon';

interface SalesmanDashboardProps {
    salesman: Salesman;
    customers: Customer[];
    onLogout: () => void;
}

const SalesmanDashboard: React.FC<SalesmanDashboardProps> = ({ salesman, customers, onLogout }) => {
    
    const assignedCustomers = customers.filter(c => c.salesmanId === salesman.id);
    const deliveriesToday = assignedCustomers.filter(c => c.deliveryDueToday).length;

    return (
        <div className="min-h-screen bg-brand-background">
             <header className="h-20 bg-brand-surface border-b border-gray-200 flex items-center justify-between px-6">
                <div className="flex items-center text-brand-text-primary">
                    <TruckIcon className="h-8 w-8 text-brand-blue" />
                    <h1 className="ml-3 text-xl font-bold">Salesman Portal</h1>
                </div>
                 <div className="flex items-center">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-brand-text-primary">{salesman.name}</p>
                        <p className="text-xs text-brand-text-secondary">Salesman</p>
                    </div>
                     <button onClick={onLogout} className="ml-6 flex items-center text-sm text-red-500 hover:text-red-700 font-medium">
                        <LogoutIcon className="h-5 w-5 mr-1" />
                        Logout
                    </button>
                </div>
            </header>
            <main className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-brand-surface p-6 rounded-xl shadow-md">
                        <p className="text-sm font-medium text-brand-text-secondary">Total Assigned Customers</p>
                        <p className="text-3xl font-bold text-brand-text-primary">{assignedCustomers.length}</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-xl shadow-md">
                        <p className="text-sm font-medium text-brand-text-secondary">Deliveries Scheduled Today</p>
                        <p className="text-3xl font-bold text-brand-blue">{deliveriesToday}</p>
                    </div>
                </div>
                <DeliveryList customers={assignedCustomers} />
            </main>
        </div>
    );
};

export default SalesmanDashboard;
