import React, { useState } from 'react';
import { Customer, Salesman } from '../../types';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCustomer: (customer: Omit<Customer, 'id' | 'bottlesPurchased' | 'paidBottles' | 'totalBalance' | 'deliveryDueToday' | 'dailyRequirement' | 'deliveryDays' | 'emptyBottlesOnHand'>) => void;
    salesmen: Salesman[];
    areas?: { id: number; name: string }[];
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onAddCustomer, salesmen, areas }) => {
    const [name, setName] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [floor, setFloor] = useState(0);
    const [mobile, setMobile] = useState('');
    const [salesmanId, setSalesmanId] = useState<number | undefined>(undefined);
    const [sector, setSector] = useState<string | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCustomer({
            name,
            houseNumber,
            floor,
            mobile,
            salesmanId,
            sector,
        });
        setName('');
        setHouseNumber('');
        setFloor(0);
        setMobile('');
        setSalesmanId(undefined);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Add New Customer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="houseNumber" className="block text-sm font-medium text-brand-text-secondary">House Number</label>
                        <input type="text" id="houseNumber" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="floor" className="block text-sm font-medium text-brand-text-secondary">Floor</label>
                        <input type="number" id="floor" value={floor} onChange={e => setFloor(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-brand-text-secondary">Mobile Number</label>
                        <input type="tel" id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>
                    {/* Per-customer bottle price removed. Pricing comes from inventory item sellPrice. */}
                    <div>
                        <label htmlFor="assign-salesman" className="block text-sm font-medium text-brand-text-secondary">Assign Salesman</label>
                        <select
                            id="assign-salesman"
                            value={salesmanId || ''}
                            onChange={e => setSalesmanId(e.target.value ? Number(e.target.value) : undefined)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        >
                            <option value="">Unassigned</option>
                            {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sector" className="block text-sm font-medium text-brand-text-secondary">Sector</label>
                        <select id="sector" value={sector ?? ''} onChange={e => setSector(e.target.value ? e.target.value : undefined)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                            <option value="">Select sector</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                            <option value="G">G</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Add Customer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;