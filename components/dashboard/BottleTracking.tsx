// Implemented the BottleTracking component.
import React from 'react';
import { Customer } from '../../types';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';

interface BottleTrackingProps {
    customers: Customer[];
    onAdjustBottles: (customer: Customer) => void;
}

const BottleTracking: React.FC<BottleTrackingProps> = ({ customers, onAdjustBottles }) => {
    
    const customersWithBottleDeficit = customers
        .filter(c => (c.bottlesPurchased - (c.emptyBottlesOnHand || 0)) > 0)
        .sort((a, b) => (b.bottlesPurchased - (b.emptyBottlesOnHand || 0)) - (a.bottlesPurchased - (a.emptyBottlesOnHand || 0)));

    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">Empty Bottle Tracking</h2>
                <p className="text-sm text-brand-text-secondary mt-1">
                    Track customers with outstanding empty bottles.
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Customer Name</th>
                            <th scope="col" className="px-6 py-3">Total Delivered</th>
                            <th scope="col" className="px-6 py-3">Empty On Hand</th>
                            <th scope="col" className="px-6 py-3">Outstanding Bottles</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customersWithBottleDeficit.length > 0 ? (
                            customersWithBottleDeficit.map((customer) => {
                                const outstanding = customer.bottlesPurchased - (customer.emptyBottlesOnHand || 0);
                                return (
                                    <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-brand-text-primary">{customer.name}</td>
                                        <td className="px-6 py-4">{customer.bottlesPurchased}</td>
                                        <td className="px-6 py-4">{customer.emptyBottlesOnHand || 0}</td>
                                        <td className="px-6 py-4 font-bold text-red-600">{outstanding}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => onAdjustBottles(customer)}
                                                className="flex items-center text-sm font-medium text-brand-blue hover:underline"
                                            >
                                                <RefreshCwIcon className="h-4 w-4 mr-1"/>
                                                Adjust
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                             <tr>
                                <td colSpan={5} className="text-center py-10 px-6">
                                    <p className="text-brand-text-secondary">All empty bottles have been accounted for.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BottleTracking;
