import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container text-center mt-5">
          <h2>Something went wrong.</h2>
          <div className="alert alert-danger mt-3">
            <h4>Error Details:</h4>
            <pre
              style={{
                textAlign: 'left',
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
            >
              {this.state.error && String(this.state.error)}
            </pre>
            {this.state.errorInfo && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                <summary>Stack Trace</summary>
                {this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
