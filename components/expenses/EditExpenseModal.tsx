import React, { useState, useEffect } from 'react';
import { Expense, ExpenseAccount } from '../../types';

interface EditExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense: Expense | null;
    onUpdateExpense: (expense: Expense) => void;
    accounts?: ExpenseAccount[];
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ isOpen, onClose, expense, onUpdateExpense, accounts = [] }) => {
    const [date, setDate] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState(0);
    const [paymentAccount, setPaymentAccount] = useState<'cash'|'bank'>('cash');
    const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (expense) {
            setDate(expense.date);
            setName(expense.name || expense.category || '');
            setDescription(expense.description);
            setCategory(expense.category || '');
            setPaymentAccount(expense.paymentAccount || 'cash');
            setSelectedAccountId(expense.accountId);
            setAmount(expense.amount);
        }
    }, [expense]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (expense) {
            const updatedExpense: Expense = {
                ...expense,
                date,
                name,
                description,
                category,
                amount,
                paymentAccount,
                accountId: selectedAccountId,
            };
            onUpdateExpense(updatedExpense);
        }
    };

    if (!isOpen || !expense) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Edit Expense</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-date" className="block text-sm font-medium text-brand-text-secondary">Date</label>
                        <input type="date" id="edit-date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-account" className="block text-sm font-medium text-brand-text-secondary">Account / Owner (optional)</label>
                        <select id="edit-account" value={selectedAccountId ?? ''} onChange={e => setSelectedAccountId(e.target.value ? Number(e.target.value) : undefined)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                            <option value="">-- Select account --</option>
                            {/** accounts prop may be undefined; guard */}
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-brand-text-secondary">Name</label>
                        <input type="text" id="edit-name" value={name} placeholder="e.g., Electricity, Rent" onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-brand-text-secondary">Description</label>
                        <input type="text" id="edit-description" value={description} placeholder="e.g., Monthly electricity bill" onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-category" className="block text-sm font-medium text-brand-text-secondary">Category</label>
                        <input type="text" id="edit-category" value={category} placeholder="e.g., Utilities" onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="edit-payment-account" className="block text-sm font-medium text-brand-text-secondary">Payment From</label>
                        <select id="edit-payment-account" value={paymentAccount} onChange={e => setPaymentAccount(e.target.value as 'cash'|'bank')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-brand-text-secondary">Amount (PKR)</label>
                        <input type="number" id="edit-amount" value={amount} onChange={e => setAmount(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Update Expense</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;
