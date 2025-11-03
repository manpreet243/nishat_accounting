import React, { useState } from 'react';
import { Customer, Salesman, SaleRecord, BottleLog } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { EditIcon } from '../icons/EditIcon';
import { TruckIcon } from '../icons/TruckIcon';

interface CustomerTableProps {
    customers: Customer[];
    salesmen: Salesman[];
    sales: SaleRecord[];
    bottleLogs: BottleLog[];
    onAddCustomer: () => void;
    onAddSale: (customer: Customer) => void;
    onViewDetails: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, salesmen, sales, bottleLogs, onAddCustomer, onAddSale, onViewDetails, onDelete, onEdit }) => {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    const toggleExpanded = (id: number) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };
    
    const getUnpaidBottles = (customer: Customer) => {
        return customer.bottlesPurchased - customer.paidBottles;
    };

    const getSalesmanName = (salesmanId?: number) => {
        if (!salesmanId) return 'Unassigned';
        return salesmen.find(s => s.id === salesmanId)?.name || 'Unknown';
    }

    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">All Clients</h2>
                <button 
                  onClick={onAddCustomer}
                  className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Add Customer
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Customer Name</th>
                            <th scope="col" className="px-6 py-3">Total Balance (PKR)</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">History</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <React.Fragment key={customer.id}>
                                <tr className={`border-b ${customer.deliveryDueToday ? 'bg-red-50' : 'bg-white'}`}>
                                    <th scope="row" className="px-6 py-4 font-medium text-brand-text-primary whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div>
                                            <div className="flex items-center">
                                              {customer.name}
                                              {customer.deliveryDueToday && <span className="ml-2 text-xs font-semibold text-red-700 bg-red-200 px-2 py-0.5 rounded-full">Due Today</span>}
                                            </div>
                                            <div className="text-xs text-brand-text-secondary">House: {customer.houseNumber}, Floor: {customer.floor}</div>
                                            <div className="text-xs text-brand-text-secondary mt-1 flex items-center">
                                                <TruckIcon className="h-4 w-4 mr-1.5 text-gray-400"/>
                                                {getSalesmanName(customer.salesmanId)}
                                            </div>
                                          </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4 font-semibold">{customer.totalBalance.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {customer.totalBalance > 0 ? (
                                            <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Paid</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleExpanded(customer.id)} className="text-sm text-brand-blue underline">
                                            {expanded.has(customer.id) ? 'Hide History' : 'Show History'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button onClick={() => onViewDetails(customer)} className="font-medium text-blue-600 hover:underline">Details</button>
                                        <button onClick={() => onEdit(customer)} title="Edit Customer" className="text-brand-blue hover:text-brand-lightblue">
                                            <EditIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => onAddSale(customer)} className="font-medium text-green-600 hover:underline">Add Sale</button>
                                        <button onClick={() => onDelete(customer)} title="Delete Customer" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>

                                {expanded.has(customer.id) && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={5} className="px-4 py-4">
                                            {/* Transaction history table for this customer */}
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-brand-text-secondary">
                                                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100">
                                                        <tr>
                                                            <th className="px-3 py-2">Date</th>
                                                            <th className="px-3 py-2">Quantity</th>
                                                            <th className="px-3 py-2">Bottle Rate</th>
                                                            <th className="px-3 py-2">Amount</th>
                                                            <th className="px-3 py-2">Received</th>
                                                            <th className="px-3 py-2">Balance</th>
                                                            <th className="px-3 py-2">Remaining Empty</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(() => {
                                                            const custSales = sales.filter(s => s.customerId === customer.id);
                                                            const custLogs = bottleLogs.filter(l => l.customerId === customer.id);
                                                            type Ev = { type: 'sale' | 'log'; date: string; payload: any };
                                                            const events: Ev[] = [];
                                                            custSales.forEach(s => events.push({ type: 'sale', date: s.date, payload: s }));
                                                            custLogs.forEach(l => events.push({ type: 'log', date: l.date, payload: l }));
                                                            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                                            let runningEmpty = 0;
                                                            const rows: any[] = [];
                                                            events.forEach(e => {
                                                                if (e.type === 'log') {
                                                                    const l = e.payload;
                                                                    const taken = (l.bottlesTaken || 0);
                                                                    const returned = (l.bottlesReturned || 0);
                                                                    runningEmpty += taken - returned;
                                                                } else {
                                                                    const s = e.payload;
                                                                    const rate = (typeof s.unitPrice === 'number' && s.unitPrice > 0) ? s.unitPrice : (s.bottlesSold > 0 && s.amountReceived ? s.amountReceived / s.bottlesSold : undefined);
                                                                    const amount = rate ? rate * s.bottlesSold : (s.amountReceived || 0);
                                                                    const balance = amount - (s.amountReceived || 0);
                                                                    const sold = s.bottlesSold || 0;
                                                                    const ret = s.bottlesReturned || 0;
                                                                    runningEmpty += sold - ret;
                                                                    rows.push({ date: s.date, qty: sold, rate, amount, received: s.amountReceived || 0, balance, remainingEmpty: runningEmpty });
                                                                }
                                                            });

                                                            if (rows.length === 0) {
                                                                return <tr><td colSpan={7} className="px-3 py-6 text-center">No history</td></tr>;
                                                            }
                                                            return rows.map((r, idx) => (
                                                                <tr key={idx} className="bg-white border-b">
                                                                    <td className="px-3 py-2">{new Date(r.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                                                    <td className="px-3 py-2">{r.qty}</td>
                                                                    <td className="px-3 py-2">{r.rate ? `PKR ${Number(r.rate).toFixed(2)}` : '—'}</td>
                                                                    <td className="px-3 py-2">{`PKR ${Number(r.amount).toFixed(2)}`}</td>
                                                                    <td className="px-3 py-2 font-semibold">{`PKR ${Number(r.received).toFixed(2)}`}</td>
                                                                    <td className="px-3 py-2">{`PKR ${Number(r.balance).toFixed(2)}`}</td>
                                                                    <td className="px-3 py-2">{r.remainingEmpty}</td>
                                                                </tr>
                                                            ));
                                                        })()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No customers found. Try adjusting your search or filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;