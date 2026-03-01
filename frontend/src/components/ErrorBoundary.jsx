import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
          <p style={{ fontSize: '16px', marginBottom: '12px' }}>Something went wrong</p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 20px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              background: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
