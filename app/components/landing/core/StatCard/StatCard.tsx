import React from 'react';
import './StatCard.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBg: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBg,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 ${iconBg} rounded-md flex items-center justify-center`}
          >
            <span className="text-white text-sm font-medium">{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};
