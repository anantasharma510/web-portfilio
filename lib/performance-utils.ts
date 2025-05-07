/**
 * Throttle function to limit how often a function can be called
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): (...args: Parameters<T>) => ReturnType<T> | undefined {
    let inThrottle = false
    let lastResult: ReturnType<T>
  
    return function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
      if (!inThrottle) {
        lastResult = func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
      return lastResult
    }
  }
  
  /**
   * Debounce function to delay execution until after a period of inactivity
   */
  export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
  
    return function (this: any, ...args: Parameters<T>): void {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }
  
  /**
   * Detect if the user prefers reduced motion
   */
  export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }
  
  /**
   * Lazy load a component or resource
   */
  export async function lazyLoad<T>(importFn: () => Promise<T>, fallback: T | null = null): Promise<T> {
    try {
      return await importFn()
    } catch (error) {
      console.error("Failed to lazy load:", error)
      if (fallback !== null) return fallback
      throw error
    }
  }
  