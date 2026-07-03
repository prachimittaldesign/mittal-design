import { Component, type ReactNode } from 'react'

// Catches failures from the lazy 3D experience — a chunk that fails to download
// on a flaky connection, or a runtime crash inside the WebGL scene — and shows
// the given fallback instead of a white screen. `resetKey` lets a Retry action
// remount the children from scratch.
interface Props {
  children: ReactNode
  fallback: (retry: () => void) => ReactNode
  resetKey: number
}
interface State {
  failed: boolean
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidUpdate(prev: Props) {
    // A Retry bumps resetKey → clear the error so children try again.
    if (prev.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false })
    }
  }

  componentDidCatch(error: unknown) {
    // Surfaced for debugging; the fallback UI is the user-facing recovery.
    console.error('[scene] failed to load or render:', error)
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback(() => this.setState({ failed: false }))
    }
    return this.props.children
  }
}
