import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { AppText } from './AppText';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production, forward to Sentry / crash tracker
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container}>
          <AppText variant="h3" align="center" style={styles.title}>
            Something went wrong
          </AppText>
          <AppText
            variant="bodySm"
            align="center"
            style={styles.message}
          >
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </AppText>
          <TouchableOpacity style={styles.button} onPress={this.reset}>
            <AppText variant="label" color={Colors.textInverse}>
              Try Again
            </AppText>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
    gap: 12,
  },
  title: { color: Colors.textPrimary },
  message: { color: Colors.textSecondary, textAlign: 'center' },
  button: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
});