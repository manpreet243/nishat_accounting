// Implemented the CustomerDetail component.
import React from 'react';
import { Customer, SaleRecord, Salesman, BottleLog } from '../../types';
import { TruckIcon } from '../icons/TruckIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { generateWhatsAppReminderUrl, generateWhatsAppMessageText } from '../../utils/whatsapp';

interface CustomerDetailProps {
    customer: Customer;
    salesHistory: SaleRecord[];
    bottleLogs: BottleLog[];
    salesmen: Salesman[];
    onBack: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, salesHistory, bottleLogs, salesmen, onBack }) => {
    
    const getUnpaidBottles = (c: Customer) => {
        return c.bottlesPurchased - c.paidBottles;
    };

    const salesmanName = customer.salesmanId 
        ? salesmen.find(s => s.id === customer.salesmanId)?.name || 'Unknown' 
        : 'Unassigned';

    // Determine the latest bottle rate for this customer from sales (prefer explicit unitPrice, fallback to amountReceived/bottlesSold)
    const lastSale = salesHistory && salesHistory.length > 0 ? salesHistory.reduce((latest, s) => {
        return (!latest || new Date(s.date) > new Date(latest.date)) ? s : latest;
    }, salesHistory[0] as SaleRecord) : null;

    const lastBottleRate = lastSale ? (typeof lastSale.unitPrice === 'number' && lastSale.unitPrice > 0 ? lastSale.unitPrice : (lastSale.bottlesSold > 0 && lastSale.amountReceived ? lastSale.amountReceived / lastSale.bottlesSold : undefined)) : undefined;

    // Aggregate returned bottles from bottleLogs and sales history (both may record returns)
    const returnedFromLogs = bottleLogs.reduce((sum, l) => sum + (l.bottlesReturned || 0), 0);
    const returnedFromSales = salesHistory.reduce((sum, s) => sum + (s.bottlesReturned || 0), 0);
    const totalReturnedBottles = returnedFromLogs + returnedFromSales;

    const handleSendReminder = () => {
        // Compute totals from sales history (use selling history only)
        const totalBottles = salesHistory.reduce((s, r) => s + (r.bottlesSold || 0), 0);
        const paidAmount = salesHistory.reduce((s, r) => s + (r.amountReceived || 0), 0);
        const multiplier = lastBottleRate || customer.lastKnownRate || 0;
        const paidBottles = multiplier ? Math.floor(paidAmount / multiplier) : 0;
        const unpaidBottles = Math.max(0, totalBottles - paidBottles);
        const totalAmount = multiplier ? totalBottles * multiplier : paidAmount;
        const unpaidAmount = totalAmount - paidAmount;

        const todayIso = new Date().toISOString().split('T')[0];
        const previousBalance = typeof customer.totalBalance === 'number' ? customer.totalBalance - paidAmount : undefined;

        const opts = {
            date: todayIso,
            multiplier: multiplier || undefined,
            previousBalance,
            dailySale: paidAmount,
            totalBottles,
            paidBottles,
            unpaidBottles,
            totalAmount,
            paidAmount,
            unpaidAmount,
            emptyBottles: (customer.emptyBottlesOnHand || 0) - totalReturnedBottles
        };

        const url = generateWhatsAppReminderUrl(customer, opts);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="printable-area bg-brand-surface rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary">{customer.name}</h1>
                    <p className="text-brand-text-secondary">
                        {`House: ${customer.houseNumber}, Floor: ${customer.floor}`}{(customer as any).flat ? `, Flat: ${(customer as any).flat}` : ''}
                    </p>
                    <p className="text-brand-text-secondary">Mobile: {customer.mobile}</p>
                    <p className="text-brand-text-secondary mt-1 flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2 text-gray-400"/> 
                        Assigned Salesman: <span className="font-semibold ml-1">{salesmanName}</span>
                    </p>
                </div>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 no-print">
                    &larr; Back to Customers
                </button>
            </div>
            
            {/* Stats removed per request; transaction history is shown below */}

            {/* Actions Bar */}
            <div className="p-4 flex justify-end items-center bg-gray-50 no-print mb-8 rounded-lg">
                <button 
                    onClick={handleSendReminder}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                    Send Reminder via WhatsApp
                </button>
            </div>

            {/* Transaction History (full-width) */}
            <div className="mb-8">
                 <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50">
                        <h2 className="text-xl font-bold text-brand-text-primary">Transaction History</h2>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                         <table className="w-full text-sm text-left text-brand-text-secondary">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Date</th>
                                    <th scope="col" className="px-4 py-2">Quantity</th>
                                    <th scope="col" className="px-4 py-2">Bottle Rate (PKR)</th>
                                    <th scope="col" className="px-4 py-2">Amount</th>
                                    <th scope="col" className="px-4 py-2">Received</th>
                                    <th scope="col" className="px-4 py-2">Balance</th>
                                    <th scope="col" className="px-4 py-2">Remaining Empty Bottles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesHistory.length > 0 ? (() => {
                                    // Merge sales and bottleLogs by date to compute running empty bottles
                                    type Event = { type: 'sale' | 'log'; date: string; payload: any };
                                    const events: Event[] = [];
                                    salesHistory.forEach(s => events.push({ type: 'sale', date: s.date, payload: s }));
                                    bottleLogs.forEach(l => events.push({ type: 'log', date: l.date, payload: l }));
                                    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                    let runningEmpty = 0;
                                    // Build rows for sales only, after applying events in chronological order
                                    const saleRows: Array<{
                                        sale: any;
                                        rate?: number;
                                        amount: number;
                                        balance: number;
                                        remainingEmpty: number;
                                    }> = [];

                                    events.forEach(e => {
                                        if (e.type === 'log') {
                                            const l = e.payload as any;
                                            const taken = (l.bottlesTaken || 0);
                                            const returned = (l.bottlesReturned || 0);
                                            runningEmpty += taken - returned;
                                        } else {
                                            const s = e.payload as any;
                                            const rate = (typeof s.unitPrice === 'number' && s.unitPrice > 0) ? s.unitPrice : (s.bottlesSold > 0 && s.amountReceived ? s.amountReceived / s.bottlesSold : undefined);
                                            const amount = rate ? rate * s.bottlesSold : (s.amountReceived || 0);
                                            const balance = amount - (s.amountReceived || 0);
                                            // Update running empty using sale data: sold adds bottles, returned reduces
                                            const sold = s.bottlesSold || 0;
                                            const ret = s.bottlesReturned || 0;
                                            runningEmpty += sold - ret;

                                            saleRows.push({ sale: s, rate, amount, balance, remainingEmpty: runningEmpty });
                                        }
                                    });

                                    return saleRows.map(sr => (
                                        <tr key={sr.sale.id} className="bg-white border-b last:border-b-0">
                                            <td className="px-4 py-2">{new Date(sr.sale.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                            <td className="px-4 py-2">{sr.sale.bottlesSold}</td>
                                            <td className="px-4 py-2">{sr.rate ? `PKR ${Number(sr.rate).toFixed(2)}` : '—'}</td>
                                            <td className="px-4 py-2">{`PKR ${Number(sr.amount).toFixed(2)}`}</td>
                                            <td className="px-4 py-2 font-semibold">{sr.sale.amountReceived ? `PKR ${Number(sr.sale.amountReceived).toFixed(2)}` : 'PKR 0.00'}</td>
                                            <td className="px-4 py-2">{`PKR ${Number(sr.balance).toFixed(2)}`}</td>
                                            <td className="px-4 py-2">{sr.remainingEmpty}</td>
                                        </tr>
                                    ));
                                })() : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 px-6 text-brand-text-secondary">
                                            No transaction history found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reminder Preview for PDF */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">WhatsApp Reminder Preview</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    {/* Preview uses selling-history-derived values as well */}
                    {(() => {
                        const totalBottles = salesHistory.reduce((s, r) => s + (r.bottlesSold || 0), 0);
                        const paidAmount = salesHistory.reduce((s, r) => s + (r.amountReceived || 0), 0);
                        const multiplier = lastBottleRate || customer.lastKnownRate || 0;
                        const paidBottles = multiplier ? Math.floor(paidAmount / multiplier) : 0;
                        const unpaidBottles = Math.max(0, totalBottles - paidBottles);
                        const totalAmount = multiplier ? totalBottles * multiplier : paidAmount;
                        const unpaidAmount = totalAmount - paidAmount;
                        const todayIso = new Date().toISOString().split('T')[0];
                        const previousBalance = typeof customer.totalBalance === 'number' ? customer.totalBalance - paidAmount : undefined;
                        const opts = {
                            date: todayIso,
                            multiplier: multiplier || undefined,
                            previousBalance,
                            dailySale: paidAmount,
                            totalBottles,
                            paidBottles,
                            unpaidBottles,
                            totalAmount,
                            paidAmount,
                            unpaidAmount,
                            emptyBottles: (customer.emptyBottlesOnHand || 0) - totalReturnedBottles
                        } as any;
                        return <pre className="whitespace-pre-wrap text-sm text-brand-text-secondary font-sans">{generateWhatsAppMessageText(customer, opts)}</pre>;
                    })()}
                </div>
            </div>

        </div>
    );
};

export default CustomerDetail;