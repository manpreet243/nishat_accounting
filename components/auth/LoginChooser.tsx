
import React from 'react';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { TruckIcon } from '../icons/TruckIcon';
import { WaterDropIcon } from '../icons/WaterDropIcon';

interface LoginChooserProps {
    onChoose: (userType: 'admin' | 'salesman') => void;
}

const LoginChooser: React.FC<LoginChooserProps> = ({ onChoose }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue to-brand-lightblue">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-brand-accent rounded-full mb-4">
                        <WaterDropIcon className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
                        Welcome to Nishat Beverages
                    </h2>
                    <p className="mt-2 text-center text-md text-brand-text-secondary">
                        Please select your role to sign in.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => onChoose('admin')}
                        className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all duration-300 transform hover:scale-105"
                    >
                        <UserCircleIcon className="h-6 w-6 mr-3" />
                        Admin Login
                    </button>
                    <button
                        onClick={() => onChoose('salesman')}
                        className="group relative w-full flex items-center justify-center py-4 px-4 border-2 border-brand-blue text-lg font-medium rounded-md text-brand-blue bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all duration-300 transform hover:scale-105"
                    >
                        <TruckIcon className="h-6 w-6 mr-3" />
                        Salesman Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginChooser;