import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-8 text-neutral-900 sm:px-6">
          <div className="w-full max-w-md space-y-4 rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
            <h1 className="text-2xl font-bold sm:text-3xl">Something went wrong</h1>
            <p role="alert">The application couldn’t display this page. Please reload and try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Reload Page
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
