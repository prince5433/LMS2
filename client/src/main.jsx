import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './darkModeOverrides.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { appStore } from './app/store.js';
import { Toaster } from 'sonner';
import { useLoadUserQuery } from './features/api/authApi';
import { LoadingSpinner } from './components/LazyWrapper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service if needed
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      let errorMessage = 'Unknown error occurred.';
      if (this.state.error) {
        if (typeof this.state.error === 'object' && this.state.error !== null && 'message' in this.state.error) {
          errorMessage = this.state.error.message;
        } else if (typeof this.state.error === 'string') {
          errorMessage = this.state.error;
        }
      }
      return (
        <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <pre>
            {errorMessage}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return isLoading ? <LoadingSpinner /> : <>{children}</>;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <ErrorBoundary>
        <Custom>
          <App />
          <Toaster />
        </Custom>
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);


