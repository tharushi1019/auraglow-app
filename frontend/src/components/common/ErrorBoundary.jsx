import React from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          background: 'var(--color-bg-primary, #0f0f12)',
          color: 'var(--color-text-primary, #fff)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌸</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '8px' }}>
            Something went wrong while rendering this view
          </h2>
          <p style={{ color: 'var(--color-text-secondary, #aaa)', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.6 }}>
            {this.state.error?.message || 'A temporary display issue occurred. Please try refreshing the page.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              className="btn btn-primary btn-pill"
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #e87296, #b8a9d9)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
              }}
            >
              🔄 Refresh View
            </button>
            <Link
              to="/products"
              className="btn btn-secondary btn-pill"
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Browse All Products
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
