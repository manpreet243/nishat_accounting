
import React from 'react';
import { BellIcon } from '../icons/BellIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { LogoutIcon } from '../icons/LogoutIcon';

interface HeaderProps {
    onLogout: () => void;
    adminName?: string | null;
    onOpenNotifications?: () => void;
    notificationsCount?: number;
}

const Header: React.FC<HeaderProps> = ({ onLogout, adminName, onOpenNotifications, notificationsCount }) => {
    return (
        <header className="h-20 bg-brand-surface border-b border-gray-200 flex items-center justify-end px-6">
            <div className="flex items-center space-x-6">
                <button onClick={() => onOpenNotifications && onOpenNotifications()} className="relative text-brand-text-secondary hover:text-brand-blue" aria-label="Open notifications">
                    <BellIcon className="h-6 w-6" />
                    {typeof notificationsCount === 'number' && notificationsCount > 0 ? (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">{notificationsCount}</span>
                    ) : (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full opacity-0"></span>
                    )}
                </button>
                <div className="flex items-center">
                    <UserCircleIcon className="h-10 w-10 text-brand-text-secondary" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-brand-text-primary">{adminName ? adminName : 'Admin User'}</p>
                        <p className="text-xs text-brand-text-secondary">Administrator</p>
                    </div>
                </div>
                <button onClick={onLogout} className="flex items-center text-brand-text-secondary hover:text-red-600 transition-colors">
                    <LogoutIcon className="h-6 w-6 mr-2" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
