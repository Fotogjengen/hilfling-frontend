import React, { FC } from "react";

interface Props {
  onError?: () => void;
}
interface State {
  error: Error | null;
}
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }
  componentDidCatch(error: Error, stackTrace: any) {
    // TODO: Add sentry to logging
    console.log(error);
    console.log(stackTrace);
  }
  render() {
    if (this.state.error) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
