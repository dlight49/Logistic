import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth';
import { authClient } from './auth';
import App from './App.tsx';
import './index.css';

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
        <NeonAuthUIProvider authClient={authClient}>
          <App />
        </NeonAuthUIProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  console.error("Failed to find root element");
}
