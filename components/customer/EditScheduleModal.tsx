import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';

interface EditScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    onSave: (customerId: number, newSchedule: string[]) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ isOpen, onClose, customer, onSave }) => {
    const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (customer) {
            setSelectedDays(new Set(customer.deliveryDays));
        }
    }, [customer]);

    const handleDayToggle = (day: string) => {
        const newSelectedDays = new Set(selectedDays);
        if (newSelectedDays.has(day)) {
            newSelectedDays.delete(day);
        } else {
            newSelectedDays.add(day);
        }
        setSelectedDays(newSelectedDays);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customer) {
            onSave(customer.id, Array.from(selectedDays));
        }
        onClose();
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Edit Delivery Schedule</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <p className="text-brand-text-secondary mb-6">For: <span className="font-semibold text-brand-blue">{customer.name}</span></p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Select Delivery Days:</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {DAYS_OF_WEEK.map(day => (
                                <button
                                    type="button"
                                    key={day}
                                    onClick={() => handleDayToggle(day)}
                                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                                        selectedDays.has(day)
                                            ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                                            : 'bg-white text-brand-text-secondary border-gray-300 hover:border-brand-lightblue'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditScheduleModal;
