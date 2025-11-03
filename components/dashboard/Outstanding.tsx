import React, { useMemo, useState } from 'react';
import { Customer, SaleRecord, MonthlyClosing } from '../../types';

interface OutstandingProps {
    customers: Customer[];
    sales: SaleRecord[];
    monthlyClosings: MonthlyClosing[];
    onRecordPayment: (customerId: number, amount: number, date: string) => void;
}

const Outstanding: React.FC<OutstandingProps> = ({ customers, sales, monthlyClosings, onRecordPayment }) => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Compute outstanding as of selectedDate: start with customer.totalBalance but subtract any sales after selectedDate and include archived data up to selectedDate
    const outstandingByCustomer = useMemo(() => {
        const date = new Date(selectedDate + 'T23:59:59');

        return customers.map(c => {
            // Sum archived closings' unpaid contribution for periods ending on or before selectedDate
            // Note: monthlyClosings store already-archived sales. We'll approximate by including any monthlyClosings with periodEnd <= selectedDate and summing sales/expenses for that customer.
            const archivedSalesSum = monthlyClosings.reduce((sum, mc) => {
                if (new Date(mc.periodEnd + 'T23:59:59') <= date) {
                    const custSales = mc.sales.filter(s => s.customerId === c.id);
                    return sum + custSales.reduce((s2, s) => s2 + (s.unitPrice ? s.unitPrice * s.bottlesSold : (s.amountReceived || 0)), 0);
                }
                return sum;
            }, 0);

            const archivedReceived = monthlyClosings.reduce((sum, mc) => {
                if (new Date(mc.periodEnd + 'T23:59:59') <= date) {
                    const custSales = mc.sales.filter(s => s.customerId === c.id);
                    return sum + custSales.reduce((s2, s) => s2 + (s.amountReceived || 0), 0);
                }
                return sum;
            }, 0);

            // Active sales up to selected date
            const activeSalesSum = sales.reduce((sum, s) => {
                const sDate = new Date(s.date + 'T00:00:00');
                if (s.customerId === c.id && sDate <= date) {
                    return sum + (s.unitPrice ? s.unitPrice * s.bottlesSold : (s.amountReceived || 0));
                }
                return sum;
            }, 0);

            const activeReceived = sales.reduce((sum, s) => {
                const sDate = new Date(s.date + 'T00:00:00');
                if (s.customerId === c.id && sDate <= date) {
                    return sum + (s.amountReceived || 0);
                }
                return sum;
            }, 0);

            // approximate balance as of selected date by taking current totalBalance and removing any activity after the date
            // compute postDateExpected and postDateReceived to subtract
            const postDateExpected = customers.find(cc => cc.id === c.id) ? 0 : 0; // placeholder if needed

            const approxBalanceAsOfDate = (c.totalBalance + archivedSalesSum - archivedReceived) - (activeSalesSum - activeReceived);

            return {
                customer: c,
                outstanding: Math.max(0, Math.round(approxBalanceAsOfDate)),
            };
        }).sort((a, b) => b.outstanding - a.outstanding);
    }, [customers, sales, monthlyClosings, selectedDate]);

    const totalOutstanding = outstandingByCustomer.reduce((s, c) => s + c.outstanding, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-text-primary">Outstanding Balances (Date-wise)</h1>
                <div className="flex items-center gap-4">
                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 border rounded" />
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Total Outstanding (as of {selectedDate})</div>
                        <div className="text-lg font-bold">PKR {totalOutstanding.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="bg-brand-surface rounded-xl shadow-md p-6">
                <table className="w-full text-sm">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-right">Outstanding (PKR)</th>
                            <th className="px-4 py-2 text-right">Record Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outstandingByCustomer.map(({ customer, outstanding }) => (
                            <tr key={customer.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{customer.name}</td>
                                <td className="px-4 py-3 text-right font-medium">{outstanding.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">
                                    <PaymentCell customerId={customer.id} date={selectedDate} onRecordPayment={onRecordPayment} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PaymentCell: React.FC<{ customerId: number; date: string; onRecordPayment: (customerId: number, amount: number, date: string) => void }> = ({ customerId, date, onRecordPayment }) => {
    const [amount, setAmount] = useState<number | ''>('');
    return (
        <div className="flex justify-end items-center gap-2">
            <input type="number" value={amount as any} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" className="px-2 py-1 border rounded w-28 text-right" />
            <button onClick={() => { if (amount && amount > 0) { onRecordPayment(customerId, amount as number, date); setAmount(''); } }} className="px-3 py-1 bg-green-500 text-white rounded">Receive</button>
        </div>
    );
};

export default Outstanding;
