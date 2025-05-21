import React from 'react';
import AppRoute from './routes/AppRoute';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <AppRoute />
    </ErrorBoundary>
  );
};

export default App;