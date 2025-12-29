import React, { Suspense, lazy } from 'react';

const LazyConfigProvider = lazy(() => import('antd').then(m => ({ default: m.ConfigProvider })));

interface AntdProviderProps {
  children: React.ReactNode;
}

export const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  const theme = {
    token: {
      colorPrimary: '#1e3a8a',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#dc2626',
      borderRadius: 6,
    },
  };

  return (
    <Suspense fallback={<>{children}</>}>
      <LazyConfigProvider theme={theme}>{children}</LazyConfigProvider>
    </Suspense>
  );
};

export default AntdProvider;
