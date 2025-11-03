import React from 'react';
import { Expense, ExpenseAccount } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // when account is null, modal shows all accounts combined
  account: ExpenseAccount | null;
  expenses: Expense[];
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (id: number) => void;
  accounts?: ExpenseAccount[];
  onAddExpense?: (initialAccountId?: number | null) => void;
}

const AccountHistoryModal: React.FC<Props> = ({ isOpen, onClose, account, expenses, onEditExpense, onDeleteExpense, accounts = [], onAddExpense }) => {
  if (!isOpen) return null;

  // When account is null, show all expenses; otherwise filter by accountId or name
  const items = account ? expenses.filter(e => (e.accountId && account.id && e.accountId === account.id) || e.name === account.name) : expenses.slice();

  const totalCash = items.reduce((s, i) => s + ((i.paymentAccount === 'bank') ? 0 : (i.amount || 0)), 0);
  const totalBank = items.reduce((s, i) => s + ((i.paymentAccount === 'bank') ? (i.amount || 0) : 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{account ? `Account History — ${account.name}` : 'All Accounts History'}</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => onAddExpense && onAddExpense(account ? account.id : null)} className="px-3 py-1 bg-brand-blue text-white rounded">Add Expense</button>
            <button onClick={onClose} className="text-gray-500">Close</button>
          </div>
        </div>

            <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 rounded text-center">
            <div className="text-sm text-green-700">Cash Total</div>
            <div className="text-lg font-bold">PKR {totalCash.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded text-center">
            <div className="text-sm text-yellow-700">Bank Total</div>
            <div className="text-lg font-bold">PKR {totalBank.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded text-center">
            <div className="text-sm text-gray-700">Transactions</div>
            <div className="text-lg font-bold">{items.length}</div>
          </div>
        </div>

            <div className="border rounded overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                {/** show account column when viewing all accounts */}
                {!account && <th className="px-4 py-2 text-left">Account</th>}
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Payment From</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(it => (
                <tr key={it.id}>
                  <td className="px-4 py-2">{it.date}</td>
                  {!account && <td className="px-4 py-2">{(accounts.find(a => a.id === it.accountId || 0)?.name) || it.name || it.category || '—'}</td>}
                  <td className="px-4 py-2">{it.category || '-'}</td>
                  <td className="px-4 py-2">{it.name || it.category}</td>
                  <td className="px-4 py-2">{it.paymentAccount === 'bank' ? 'Bank' : 'Cash'}</td>
                  <td className="px-4 py-2 text-right">{(it.amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {onEditExpense && <button onClick={() => onEditExpense(it)} className="text-brand-blue hover:underline mr-2">Edit</button>}
                    {onDeleteExpense && <button onClick={() => { if (confirm('Delete this expense?')) onDeleteExpense(it.id); }} className="text-red-600 hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountHistoryModal;
