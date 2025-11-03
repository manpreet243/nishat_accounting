
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'text-brand-blue' }) => {
    return (
        <div className="bg-brand-surface p-6 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div>
                <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
            </div>
            <div className={`text-4xl ${color}`}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
