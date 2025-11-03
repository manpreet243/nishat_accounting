import React from 'react';
import { View } from '../../types';

interface FooterProps {
  activeView: View;
  onNavigate: (v: View) => void;
}

const navItems: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'customers', label: 'Customers' },
  { view: 'sales', label: 'Sales' },
  { view: 'expenses', label: 'Expenses' },
  { view: 'inventory', label: 'Inventory' },
  { view: 'reports', label: 'Reports' },
  { view: 'reminders', label: 'Reminders' },
  { view: 'dailyAssigned', label: 'Daily Assigned' },
];

const Footer: React.FC<FooterProps> = ({ activeView, onNavigate }) => {
  return (
    <footer className="no-print bg-white border-t border-gray-200 p-3">
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-center items-center space-x-4">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`text-sm px-3 py-1 rounded-md focus:outline-none ${activeView === item.view ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
