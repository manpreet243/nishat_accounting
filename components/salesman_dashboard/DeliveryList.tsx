
import React from 'react';
import { Customer } from '../../types';
import { MapPinIcon } from '../icons/MapPinIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

interface DeliveryListProps {
    customers: Customer[];
}

const DeliveryList: React.FC<DeliveryListProps> = ({ customers }) => {
    
    const customersForDelivery = customers.filter(c => c.deliveryDueToday).sort((a,b) => a.name.localeCompare(b.name));

    const openGoogleMaps = (customer: Customer) => {
        const address = `${customer.houseNumber}, ${customer.flat}, Floor ${customer.floor}`;
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    };
    
    const openWhatsApp = (customer: Customer) => {
        // Ensure mobile number has country code for wa.me link to work reliably
        const phoneNumber = customer.mobile.startsWith('92') ? customer.mobile : `92${customer.mobile.substring(1)}`;
        window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }

    return (
        <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-brand-text-primary">Today's Delivery Route</h2>
                <p className="text-sm text-brand-text-secondary mt-1">
                    You have <span className="font-bold text-brand-blue">{customersForDelivery.length}</span> deliveries scheduled for today.
                </p>
            </div>
            {customersForDelivery.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {customersForDelivery.map(customer => (
                        <li key={customer.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50">
                            <div className="mb-3 sm:mb-0">
                                <p className="font-semibold text-brand-text-primary text-lg">{customer.name}</p>
                                <p className="text-sm text-brand-text-secondary">
                                    {`House: ${customer.houseNumber}, Floor: ${customer.floor}, Flat: ${customer.flat}`}
                                </p>
                                <p className="text-sm text-brand-text-secondary">Bottles to deliver: {customer.dailyRequirement || 1}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => openWhatsApp(customer)}
                                    title="Contact via WhatsApp"
                                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                >
                                    <WhatsAppIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => openGoogleMaps(customer)}
                                    title="Open in Google Maps"
                                    className="p-2 bg-blue-100 text-brand-blue rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    <MapPinIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center p-10">
                    <p className="text-brand-text-secondary">
                        No deliveries scheduled for you today. Enjoy your day!
                    </p>
                </div>
            )}
        </div>
    );
};

export default DeliveryList;
