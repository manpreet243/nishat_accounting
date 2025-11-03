// FIX: Replaced incorrect chart implementations with a single, correct version.
// Imported 'Cell' from recharts to allow for individual bar coloring.
// Used the <Cell> component inside <Bar> to dynamically set fill colors,
// which is the correct pattern for this library.
// Removed unused and buggy component definitions to clean up the file.
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface ChartData {
    name: string;
    value: number;
}

interface SimpleBarChartProps {
    data: ChartData[];
    dataKey: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, dataKey }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                    tickFormatter={(value) => 
                        typeof value === 'number' 
                        ? `PKR ${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)}` 
                        : value
                    } 
                    tick={{ fontSize: 12 }} 
                    width={80}
                />
                <Tooltip 
                    formatter={(value: number, name: string) => [`PKR ${value.toLocaleString()}`, name]} 
                    cursor={{fill: 'rgba(240, 240, 240, 0.5)'}}
                />
                <Bar dataKey={dataKey}>
                    {
                        data.map((entry, index) => {
                            const color = entry.name === 'Expenses' ? '#EF4444' : '#10B981';
                            return <Cell key={`cell-${index}`} fill={color} />;
                        })
                    }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default SimpleBarChart;
