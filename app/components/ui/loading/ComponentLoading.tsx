'use client';

import React from 'react';
import './ComponentLoading.module.scss';

interface ComponentLoadingProps {
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const ComponentLoading: React.FC<ComponentLoadingProps> = ({ 
  size = 'sm',
  className = ''
}) => {
  return (
    <div 
      className={`component-loading component-loading--${size} ${className}`}
      data-testid="component-loading"
    >
      <div className="component-loading__spinner"></div>
    </div>
  );
};

export default ComponentLoading;
