import React, { useState } from 'react';
import { Expense, ExpenseAccount } from '../../types';
import AccountHistoryModal from '../expenses/AccountHistoryModal';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

interface ExpensesProps {
    expenses: Expense[];
    accounts?: ExpenseAccount[];
    // allow opening Add Expense modal with optional preselected accountId
    onAddExpense: (initialAccountId?: number | null) => void;
    onEditExpense: (expense: Expense) => void;
    onDeleteExpense: (id: number) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, accounts = [], onAddExpense, onEditExpense, onDeleteExpense }) => {
    const [selectedAccount, setSelectedAccount] = useState<ExpenseAccount | null>(null);
    const [isHistoryOpen, setHistoryOpen] = useState(false);

    const openHistory = (accountName: string | undefined) => {
        // try find by account name
        const acc = accounts.find(a => a.name === accountName) || (accountName ? { id: 0, name: accountName } as ExpenseAccount : null);
        if (acc) {
            setSelectedAccount(acc);
            setHistoryOpen(true);
        }
    };
    const openHistoryForAccount = (acc: ExpenseAccount | null) => {
        setSelectedAccount(acc);
        setHistoryOpen(true);
    };
    // show all expenses in the management table; account column will show account holder when linked
    const allExpenses = expenses.slice();

    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">Expenses Management</h2>
                <button
                    onClick={() => onAddExpense(null)}
                    className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Expense
                </button>
            </div>
            <div className="overflow-x-auto">
                {/* Accounts list */}
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold mb-3">Accounts</h3>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => openHistoryForAccount(null)} className="px-3 py-2 bg-gray-100 rounded-md">View All Accounts</button>
                        {accounts.map(a => {
                            const items = expenses.filter(e => (e.accountId && e.accountId === a.id) || e.name === a.name);
                            const cash = items.reduce((s, i) => s + ((i.paymentAccount === 'bank') ? 0 : (i.amount || 0)), 0);
                            const bank = items.reduce((s, i) => s + ((i.paymentAccount === 'bank') ? (i.amount || 0) : 0), 0);
                            return (
                                <div key={a.id} className="flex items-start gap-3">
                                    <button onClick={() => openHistoryForAccount(a)} className="px-3 py-2 bg-white rounded-md border shadow-sm text-left">
                                    <div className="font-medium">{a.name}</div>
                                    <div className="text-xs text-gray-600">Cash: {cash.toLocaleString()} • Bank: {bank.toLocaleString()} • {items.length} txns</div>
                                    </button>
                                    <button onClick={() => onAddExpense(a.id)} className="px-2 py-1 bg-green-100 text-green-800 rounded-md">Add</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                                    <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Account Holder</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Payment From</th>
                            <th scope="col" className="px-6 py-3">Amount (PKR)</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allExpenses.length > 0 ? (
                            allExpenses.map((expense) => {
                                const acc = accounts.find(a => a.id === expense.accountId) || null;
                                return (
                                <tr key={expense.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{expense.date}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => acc ? openHistoryForAccount(acc) : openHistory(expense.name || expense.category)} className="text-left font-medium text-brand-text-primary hover:underline">
                                            {acc ? acc.name : (expense.name || '')}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">{expense.category || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${expense.paymentAccount === 'bank' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {expense.paymentAccount === 'bank' ? 'Bank' : 'Cash'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{(expense.amount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => onEditExpense(expense)} className="font-medium text-brand-blue hover:underline">Edit</button>
                                        <button onClick={() => onDeleteExpense(expense.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No expenses recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <AccountHistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setHistoryOpen(false)}
                account={selectedAccount}
                expenses={expenses}
                accounts={accounts}
                onEditExpense={(e) => { setHistoryOpen(false); onEditExpense(e); }}
                onDeleteExpense={(id) => { setHistoryOpen(false); /* bubble up */ onDeleteExpense(id); }}
                onAddExpense={(id) => { setHistoryOpen(false); onAddExpense(id); }}
            />
        </div>
    );
};

export default Expenses;

