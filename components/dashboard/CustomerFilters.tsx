import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';

interface CustomerFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    statusFilter: 'all' | 'pending' | 'paid';
    onStatusFilterChange: (status: 'all' | 'pending' | 'paid') => void;
    dueFilter: boolean;
    onDueFilterChange: (due: boolean) => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    dueFilter,
    onDueFilterChange
}) => {
    return (
        <div className="mb-6 p-4 bg-brand-surface rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Search by name, mobile, house no, or delivery area..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
                <span className="text-sm font-medium text-brand-text-secondary mr-2">Filter by:</span>
                <button 
                    onClick={() => onStatusFilterChange('all')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'all' ? 'bg-brand-blue text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => onStatusFilterChange('pending')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'pending' ? 'bg-yellow-500 text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => onStatusFilterChange('paid')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'paid' ? 'bg-green-500 text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
                >
                    Paid
                </button>
                <div className="h-6 border-l border-gray-300 mx-2 hidden sm:block"></div>
                <label className="flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={dueFilter} 
                        onChange={(e) => onDueFilterChange(e.target.checked)} 
                        className="sr-only"
                    />
                    <div className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center ${dueFilter ? 'bg-red-500 text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}>
                        <span className={`mr-2 h-3 w-3 rounded-full border-2 transition-all ${dueFilter ? 'bg-white border-red-500' : 'bg-transparent border-gray-400'}`}></span>
                        Due Today Only
                    </div>
                </label>
            </div>
        </div>
    );
};

export default CustomerFilters;