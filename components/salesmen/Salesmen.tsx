import React from 'react';
import { Salesman } from '../../types';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';

interface SalesmenProps {
    salesmen: Salesman[];
    onAddSalesman: () => void;
    onDeleteSalesman: (salesmanId: number) => void;
    onViewReport: (salesman: Salesman) => void;
    onAddPayment: (salesman: Salesman) => void;
}

const Salesmen: React.FC<SalesmenProps> = ({ salesmen, onAddSalesman, onDeleteSalesman, onViewReport, onAddPayment }) => {
    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">Salesmen Management</h2>
                <button
                    onClick={onAddSalesman}
                    className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Salesman
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Mobile</th>
                            <th scope="col" className="px-6 py-3">Hire Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesmen.length > 0 ? (
                            salesmen.map((salesman) => (
                                <tr key={salesman.id} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-brand-text-primary">{salesman.name}</td>
                                    <td className="px-6 py-4">{salesman.mobile}</td>
                                    <td className="px-6 py-4">{new Date(salesman.hireDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex items-center space-x-4">
                                        <button onClick={() => onViewReport(salesman)} className="font-medium text-brand-blue hover:underline">View Report</button>
                                        <button onClick={() => onAddPayment(salesman)} title="Add Payment" className="flex items-center text-sm font-medium text-green-600 hover:text-green-800">
                                            <DollarSignIcon className="h-4 w-4 mr-1" />
                                            Add Payment
                                        </button>
                                        <button onClick={() => onDeleteSalesman(salesman.id)} title="Delete Salesman" className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 px-6 text-brand-text-secondary">
                                    No salesmen found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Salesmen;
