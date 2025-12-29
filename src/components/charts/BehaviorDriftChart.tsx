import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const BehaviorDriftChart: React.FC = () => {
  const data = [
    { date: 'Jan 1', expectedSpending: 15000, actualSpending: 14500 },
    { date: 'Jan 8', expectedSpending: 15000, actualSpending: 16200 },
    { date: 'Jan 15', expectedSpending: 15000, actualSpending: 18900 },
    { date: 'Jan 22', expectedSpending: 15000, actualSpending: 22500 },
    { date: 'Jan 29', expectedSpending: 15000, actualSpending: 28000 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value) => `PKR ${(value as number).toLocaleString()}`}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="expectedSpending"
          stroke="#0d9488"
          name="Expected Spending"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="actualSpending"
          stroke="#dc2626"
          name="Actual Spending"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BehaviorDriftChart;
