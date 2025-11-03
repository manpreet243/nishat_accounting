import React, { useMemo } from 'react';
import { Customer } from '../../types';
import { CalendarIcon } from '../icons/CalendarIcon';

interface DeliveryScheduleProps {
    customers: Customer[];
    onEditSchedule: (customer: Customer) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DeliverySchedule: React.FC<DeliveryScheduleProps> = ({ customers, onEditSchedule }) => {
    
    const scheduleByDay = useMemo(() => {
        const schedule: { [key: string]: Customer[] } = {};
        DAYS_OF_WEEK.forEach(day => schedule[day] = []);
        
        customers.forEach(customer => {
            (customer.deliveryDays || []).forEach(day => {
                if (schedule[day]) {
                    schedule[day].push(customer);
                }
            });
        });

        return schedule;
    }, [customers]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Delivery Schedule</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer List Column */}
                <div className="lg:col-span-1 bg-brand-surface rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-brand-text-primary">Customer Schedules</h2>
                    </div>
                    <ul className="divide-y divide-gray-200 max-h-[75vh] overflow-y-auto">
                        {customers.map(customer => (
                            <li key={customer.id} className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-brand-text-primary">{customer.name}</p>
                                    <p className="text-xs text-brand-text-secondary">
                                        {(customer.deliveryDays || []).length > 0 ? customer.deliveryDays.join(', ') : 'No schedule set'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => onEditSchedule(customer)}
                                    className="text-sm font-medium text-brand-blue hover:underline"
                                >
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weekly Schedule Column */}
                <div className="lg:col-span-2 bg-brand-surface rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center">
                        <CalendarIcon className="h-6 w-6 mr-3 text-brand-blue" />
                        Weekly Delivery Plan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className="bg-gray-50 rounded-lg p-3">
                                <h3 className="font-bold text-brand-text-primary border-b pb-2 mb-2">{day}</h3>
                                {scheduleByDay[day].length > 0 ? (
                                    <ul className="space-y-2">
                                        {scheduleByDay[day].map(c => (
                                            <li key={c.id} className="text-sm text-brand-text-secondary bg-white p-2 rounded shadow-sm">
                                                {c.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic mt-2">No deliveries.</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliverySchedule;
