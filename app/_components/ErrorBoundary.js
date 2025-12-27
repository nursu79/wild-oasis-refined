"use client";

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 bg-primary-900/50 border border-accent-500/20 rounded-2xl text-center">
          <h3 className="text-accent-400 font-serif mb-2">Service Temporarily Unavailable</h3>
          <p className="text-primary-300 text-sm">We&apos;re having trouble loading this section. Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
