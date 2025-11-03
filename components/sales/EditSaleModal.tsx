import React, { useState, useEffect } from 'react';
import { SaleRecord, Salesman } from '../../types';

interface EditSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    sale: SaleRecord | null;
    onUpdateSale: (sale: SaleRecord) => void;
    salesmen: Salesman[];
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ isOpen, onClose, sale, onUpdateSale, salesmen }) => {
    const [date, setDate] = useState('');
    const [amountReceived, setAmountReceived] = useState(0);
    const [salesmanId, setSalesmanId] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState('');
    const [bottleCategory, setBottleCategory] = useState<string>('');

    useEffect(() => {
        if (sale) {
            setDate(sale.date);
            setAmountReceived(sale.amountReceived);
            setSalesmanId(sale.salesmanId);
            setDescription(sale.description || '');
            setBottleCategory(sale.bottleCategory || '');
        }
    }, [sale]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (sale) {
            onUpdateSale({
                ...sale,
                date,
                amountReceived,
                salesmanId,
                description: sale.isCounterSale ? description : sale.description,
                bottleCategory: bottleCategory || undefined,
            });
        }
    };

    if (!isOpen || !sale) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Edit Sale Record</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                </div>
                <p className="text-brand-text-secondary mb-6">Editing sale for: <span className="font-semibold text-brand-blue">{sale.customerName}</span></p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-sale-date" className="block text-sm font-medium text-brand-text-secondary">Date</label>
                        <input type="date" id="edit-sale-date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>

                    {!sale.isCounterSale && (
                         <div>
                            <label className="block text-sm font-medium text-brand-text-secondary">Bottles Sold</label>
                            <input type="number" value={sale.bottlesSold} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm" />
                            <p className="text-xs text-gray-500 mt-1">Bottle quantity cannot be edited. To change it, please delete and re-create the sale.</p>
                        </div>
                    )}

                    {!sale.isCounterSale && (
                        <div>
                            <label htmlFor="edit-bottle-category" className="block text-sm font-medium text-brand-text-secondary">Bottle Category</label>
                            <select
                                id="edit-bottle-category"
                                value={bottleCategory}
                                onChange={e => setBottleCategory(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                            >
                                <option value="">Select Category</option>
                                <option value="19-Liter">19-Liter Bottles</option>
                                <option value="5-Liter">5-Liter Bottles</option>
                                <option value="1-Liter">1-Liter Bottles</option>
                                <option value="500ml">500ml Bottles</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}
                   
                    <div>
                        <label htmlFor="edit-sale-amount" className="block text-sm font-medium text-brand-text-secondary">Amount Received (PKR)</label>
                        <input type="number" id="edit-sale-amount" value={amountReceived} onChange={e => setAmountReceived(Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                    </div>

                    {sale.isCounterSale ? (
                        <div>
                            <label htmlFor="edit-sale-description" className="block text-sm font-medium text-brand-text-secondary">Description</label>
                            <input type="text" id="edit-sale-description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="edit-sale-salesman" className="block text-sm font-medium text-brand-text-secondary">Salesman</label>
                            <select
                                id="edit-sale-salesman"
                                value={salesmanId || ''}
                                onChange={e => setSalesmanId(e.target.value ? Number(e.target.value) : undefined)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                            >
                                <option value="">None</option>
                                {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue">Update Sale</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSaleModal;
