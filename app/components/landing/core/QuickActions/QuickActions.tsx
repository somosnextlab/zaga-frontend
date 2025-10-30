import React from 'react';
import './QuickActions.module.scss';

interface QuickAction {
  title: string;
  icon: string;
  iconBg: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  columns?: 2 | 3;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  title,
  actions,
  columns = 3,
}) => {
  const gridClass =
    columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className={`grid ${gridClass} gap-4`}>
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={action.onClick}
          >
            <div className="text-center">
              <div
                className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mx-auto mb-2`}
              >
                <span className="text-xl">{action.icon}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {action.title}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
