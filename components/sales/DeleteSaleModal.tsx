import React from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

interface DeleteSaleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    saleInfo: string;
}

const DeleteSaleModal: React.FC<DeleteSaleModalProps> = ({ isOpen, onClose, onConfirm, saleInfo }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-brand-text-primary mt-4">
                        Delete Sale Record
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-brand-text-secondary">
                            Are you sure you want to delete the sale for <span className="font-bold">{saleInfo}</span>? This will revert the customer's balance and bottle counts. This action cannot be undone.
                        </p>
                    </div>
                    <div className="items-center px-4 py-3 space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 w-24"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-24"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteSaleModal;
