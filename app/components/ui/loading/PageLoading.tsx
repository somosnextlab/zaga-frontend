'use client';

import React from 'react';
import './PageLoading.module.scss';

interface PageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Cargando...', 
  size = 'md' 
}) => {
  return (
    <div className={`page-loading page-loading--${size}`} data-testid="page-loading">
      <div className="page-loading__spinner">
        <div className="page-loading__spinner-inner"></div>
      </div>
      <p className="page-loading__message">{message}</p>
    </div>
  );
};

export default PageLoading;
