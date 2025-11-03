import React, { useState } from 'react';
import { DailyBottleAssignment, Salesman } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Props {
  salesmen: Salesman[];
}

const defaultDate = () => new Date().toISOString().split('T')[0];

const DailyBottlesAssigned: React.FC<Props> = ({ salesmen }) => {
  const [assignments, setAssignments] = useLocalStorage<DailyBottleAssignment[]>('dailyAssignments', []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // form state
  const [date, setDate] = useState<string>(defaultDate());
  const [salesmanId, setSalesmanId] = useState<number | undefined>(salesmen.length > 0 ? salesmen[0].id : undefined);
  const [assignedCount, setAssignedCount] = useState<number>(0);
  const [soldCount, setSoldCount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const resetForm = () => {
    setDate(defaultDate());
    setSalesmanId(salesmen.length > 0 ? salesmen[0].id : undefined);
    setAssignedCount(0);
    setSoldCount(0);
    setNotes('');
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!salesmanId) return;
    const salesman = salesmen.find(s => s.id === salesmanId);
    const newItem: DailyBottleAssignment = {
      id: Date.now(),
      date,
      salesmanId,
      salesmanName: salesman ? salesman.name : 'Unknown',
      assignedCount,
      soldCount,
      remainingCount: Math.max(0, assignedCount - soldCount),
      notes,
    };
    setAssignments(prev => [newItem, ...prev]);
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (id: number) => {
    const it = assignments.find(a => a.id === id);
    if (!it) return;
    setEditingId(id);
    setDate(it.date);
    setSalesmanId(it.salesmanId);
    setAssignedCount(it.assignedCount);
    setSoldCount(it.soldCount);
    setNotes(it.notes || '');
    setIsAdding(true);
  };

  const handleSaveEdit = () => {
    if (editingId === null || !salesmanId) return;
    setAssignments(prev => prev.map(a => a.id === editingId ? {
      ...a,
      date,
      salesmanId,
      salesmanName: salesmen.find(s => s.id === salesmanId)?.name || a.salesmanName,
      assignedCount,
      soldCount,
      remainingCount: Math.max(0, assignedCount - soldCount),
      notes,
    } : a));
    resetForm();
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this assignment?')) return;
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-text-primary">Daily bottles Assigned</h2>
          <p className="text-sm text-brand-text-secondary">Manage daily bottle assignments per salesman (independent of inventory).</p>
        </div>
        <div>
          <button onClick={() => { resetForm(); setIsAdding(true); }} className="flex items-center bg-brand-blue text-white px-3 py-2 rounded-lg">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> New Assignment
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-brand-text-secondary">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-brand-text-secondary">Salesman</label>
              <select value={salesmanId} onChange={e => setSalesmanId(Number(e.target.value))} className="w-full mt-1 p-2 border rounded">
                {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-brand-text-secondary">Assigned</label>
              <input type="number" value={assignedCount} onChange={e => setAssignedCount(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label className="text-xs text-brand-text-secondary">Sold</label>
              <input type="number" value={soldCount} onChange={e => setSoldCount(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div className="md:col-span-6">
              <label className="text-xs text-brand-text-secondary">Notes (optional)</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            {editingId ? (
              <>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={() => { resetForm(); setIsAdding(false); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={handleAdd} className="px-4 py-2 bg-brand-blue text-white rounded">Add Assignment</button>
                <button onClick={() => { resetForm(); setIsAdding(false); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-text-secondary">
          <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Salesman</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Sold</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">No assignments yet. Add one using the button above.</td>
              </tr>
            ) : assignments.map(a => (
              <tr key={a.id} className="bg-white border-b">
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3">{a.salesmanName}</td>
                <td className="px-4 py-3 font-semibold">{a.assignedCount}</td>
                <td className="px-4 py-3">{a.soldCount}</td>
                <td className="px-4 py-3">{a.remainingCount}</td>
                <td className="px-4 py-3">{a.notes || '—'}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <button onClick={() => handleEdit(a.id)} className="text-brand-blue"><EditIcon className="h-5 w-5" /></button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-600"><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyBottlesAssigned;
