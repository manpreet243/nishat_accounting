import React, { useState, useEffect } from 'react';
import { showToast } from '../../utils/toast';

interface SettingsProps {
    currentPrice: number;
    onUpdatePrice: (newPrice: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentPrice, onUpdatePrice }) => {
    const [price, setPrice] = useState(currentPrice);

    useEffect(() => {
        setPrice(currentPrice);
    }, [currentPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (price > 0) {
            onUpdatePrice(price);
            showToast('Settings updated successfully!', 'success');
        } else {
            showToast('Price must be a positive number.', 'error');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-6">Application Settings</h1>

            <div className="bg-brand-surface rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text-primary">Pricing</h2>
                        <p className="text-sm text-brand-text-secondary mt-1">
                            Set the default price for a single water bottle. This will be used in all new sales calculations.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label htmlFor="bottle-price" className="block text-sm font-medium text-brand-text-secondary w-32">
                            Price per Bottle (PKR)
                        </label>
                        <input
                            type="number"
                            id="bottle-price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            required
                            min="1"
                            className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-blue text-white rounded-md font-semibold hover:bg-brand-lightblue transition-colors"
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;