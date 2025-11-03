// Implemented the Sidebar navigation component.
import React from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { HomeIcon } from '../icons/HomeIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { BellIcon } from '../icons/BellIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { FileTextIcon } from '../icons/FileTextIcon';
import { TruckIcon } from '../icons/TruckIcon';
import { RefreshCwIcon } from '../icons/RefreshCwIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { View } from '../../types';

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
    
    // Fix: Explicitly type the navItems array to ensure item.view is of type 'View'.
    const mainNavItems: { view: View; label: string; icon: React.ReactNode }[] = [
        { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { view: 'dailyAssigned', label: 'Daily bottles Assigned', icon: <CalendarIcon /> },
        { view: 'customers', label: 'Customers', icon: <UsersIcon /> },
        { view: 'stock', label: 'Stock', icon: <PackageIcon /> },
        { view: 'outstanding', label: 'Outstanding', icon: <DollarSignIcon /> },
        { view: 'sales', label: 'Daily Sales', icon: <DollarSignIcon /> },
        { view: 'counterSales', label: 'Counter Sales', icon: <DollarSignIcon /> },
        { view: 'expenses', label: 'Expenses', icon: <CreditCardIcon /> },
        { view: 'inventory', label: 'Inventory', icon: <PackageIcon /> },
        { view: 'schedule', label: 'Delivery Schedule', icon: <CalendarIcon /> },
        { view: 'reminders', label: 'Daily Reminders', icon: <BellIcon /> },
        { view: 'bottleTracking', label: 'Bottle Tracking', icon: <RefreshCwIcon /> },
        { view: 'salesmen', label: 'Salesmen', icon: <TruckIcon /> },
        { view: 'reports', label: 'Business Reports', icon: <BarChartIcon /> },
        { view: 'closing', label: 'Closing Report', icon: <FileTextIcon /> },
    ];
    
    const secondaryNavItems: { view: View; label: string; icon: React.ReactNode }[] = [
        // Settings removed - individual customer pricing is now used
    ];

    const NavLink: React.FC<{
        view: View,
        label: string,
        icon: React.ReactNode,
        isActive: boolean,
        onClick: () => void
    }> = ({ view, label, icon, isActive, onClick }) => (
        <li>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onClick(); }}
                className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-brand-blue text-white shadow-lg'
                        : 'text-brand-text-secondary hover:bg-brand-lightblue hover:text-white'
                }`}
            >
                <span className="h-6 w-6">{icon}</span>
                <span className="ml-4 text-sm font-medium">{label}</span>
            </a>
        </li>
    );

    return (
        <aside className="w-64 bg-brand-surface text-white flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-200">
                 <div className="flex items-center text-brand-text-primary">
                    <WaterDropIcon className="h-8 w-8 text-brand-blue" />
                    <h1 className="ml-3 text-xl font-bold">Nishat Beverages</h1>
                </div>
            </div>
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <ul>
                    {mainNavItems.map(item => (
                        <NavLink 
                            key={item.view}
                            view={item.view}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeView === item.view || (activeView === 'customerDetail' && item.view === 'customers') || (activeView === 'inventoryDetail' && item.view === 'inventory') || (activeView === 'salesmanReport' && item.view === 'salesmen')}
                            onClick={() => onNavigate(item.view)}
                        />
                    ))}
                </ul>
            </nav>
            {secondaryNavItems.length > 0 && (
                <div className="px-4 py-4 border-t border-gray-200">
                     <ul>
                        {secondaryNavItems.map(item => (
                            <NavLink 
                                key={item.view}
                                view={item.view}
                                label={item.label}
                                icon={item.icon}
                                isActive={activeView === item.view}
                                onClick={() => onNavigate(item.view)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;