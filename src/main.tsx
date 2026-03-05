import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global Fetch Interceptor to attach Authorization Headers automatically
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  if (typeof resource === 'string' && resource.startsWith('/api/')) {
    const userStr = localStorage.getItem('user') || localStorage.getItem('lumin_user');
    let token = '';
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.role === 'admin' ? 'mock_admin_token' : 'mock_driver_token';
      } catch (e) { }
    }

    config = config || {};
    config.headers = {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }
  return originalFetch(resource, config);
};

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("REACT CRASH:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: 'darkred', color: 'white', fontFamily: 'monospace' }}>
          <h2>Application Crashed!</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error("Failed to find root element");
}
