import React, { useState } from 'react';
import { Salesman } from '../../types';

interface AddSalesmanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSalesman: (salesman: Omit<Salesman, 'id'>) => void;
}

const AddSalesmanModal: React.FC<AddSalesmanModalProps> = ({ isOpen, onClose, onAddSalesman }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSalesman: Omit<Salesman, 'id'> = {
            name,
            mobile,
            hireDate,
        };
        onAddSalesman(newSalesman);
        // Reset form
        setName('');
        setMobile('');
        setHireDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Add New Salesman</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="salesman-name" className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
                        <input type="text" id="salesman-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="salesman-mobile" className="block text-sm font-medium text-brand-text-secondary">Mobile Number</label>
                        <input type="tel" id="salesman-mobile" value={mobile} onChange={e => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="salesman-hiredate" className="block text-sm font-medium text-brand-text-secondary">Hire Date</label>
                        <input type="date" id="salesman-hiredate" value={hireDate} onChange={e => setHireDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Add Salesman</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSalesmanModal;
