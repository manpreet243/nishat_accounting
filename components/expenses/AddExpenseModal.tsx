import React, { useState } from 'react';
import { Expense, ExpenseAccount } from '../../types';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddExpense: (expense: Omit<Expense, 'id'>) => void;
    accounts?: ExpenseAccount[];
    onCreateAccount?: (name: string) => ExpenseAccount;
    initialAccountId?: number | null;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onAddExpense, accounts = [], onCreateAccount, initialAccountId = null }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Defaults to today
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState(0);
    const [paymentAccount, setPaymentAccount] = useState<'cash'|'bank'>('cash');
    const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>(undefined);
    const [newAccountName, setNewAccountName] = useState('');

    // initialize selected account when initialAccountId provided
    React.useEffect(() => {
        if (initialAccountId) setSelectedAccountId(initialAccountId);
    }, [initialAccountId]);
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newExpense: Omit<Expense, 'id'> = {
            date,
            name,
            description,
            category,
            amount,
            paymentAccount,
            accountId: selectedAccountId,
        };
        onAddExpense(newExpense);
    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setName('');
    setDescription('');
    setAmount(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Add New Expense</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="account" className="block text-sm font-medium text-brand-text-secondary">Account / Owner (optional)</label>
                        <div className="mt-1 flex space-x-2">
                            <select id="account" value={selectedAccountId ?? ''} onChange={e => setSelectedAccountId(e.target.value ? Number(e.target.value) : undefined)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">-- Select existing account --</option>
                                {accounts && accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div className="mt-2 flex">
                            <input type="text" placeholder="Create new owner (e.g., Sham)" value={newAccountName} onChange={e => setNewAccountName(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                            <button type="button" onClick={() => {
                                if (!newAccountName.trim() || !onCreateAccount) return;
                                const acc = onCreateAccount(newAccountName.trim());
                                setSelectedAccountId(acc.id);
                                setNewAccountName('');
                            }} className="ml-2 px-3 py-2 bg-gray-200 rounded-md">Create</button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-brand-text-secondary">Date</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-brand-text-secondary">Category</label>
                        <input type="text" id="category" value={category} placeholder="e.g., Utilities, Rent" onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary">Name</label>
                        <input type="text" id="name" value={name} placeholder="e.g., Electricity, Rent" onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-brand-text-secondary">Description</label>
                        <input type="text" id="description" value={description} placeholder="Optional details" onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-brand-text-secondary">Amount (PKR)</label>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="payment-account" className="block text-sm font-medium text-brand-text-secondary">Payment From</label>
                        <select id="payment-account" value={paymentAccount} onChange={e => setPaymentAccount(e.target.value as 'cash'|'bank')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Add Expense</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;