// Performance monitoring and optimization utilities

// Performance metrics collection
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  // Start timing a operation
  startTiming(label) {
    if (!this.isEnabled) return;
    
    const startTime = performance.now();
    this.metrics.set(label, { startTime, endTime: null, duration: null });
    
    // Also use Performance API if available
    if (performance.mark) {
      performance.mark(`${label}-start`);
    }
  }

  // End timing and calculate duration
  endTiming(label) {
    if (!this.isEnabled) return;
    
    const endTime = performance.now();
    const metric = this.metrics.get(label);
    
    if (metric) {
      metric.endTime = endTime;
      metric.duration = endTime - metric.startTime;
      
      // Use Performance API if available
      if (performance.mark && performance.measure) {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
      }
      
      // Log slow operations
      if (metric.duration > 1000) {
        console.warn(`Slow operation detected: ${label} took ${metric.duration.toFixed(2)}ms`);
      }
      
      return metric.duration;
    }
    
    return null;
  }

  // Get timing for a specific operation
  getTiming(label) {
    return this.metrics.get(label);
  }

  // Get all metrics
  getAllMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics.clear();
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  }

  // Monitor component render times
  monitorComponentRender(componentName, renderFn) {
    if (!this.isEnabled) return renderFn();
    
    this.startTiming(`render-${componentName}`);
    const result = renderFn();
    this.endTiming(`render-${componentName}`);
    
    return result;
  }

  // Monitor API call performance
  monitorApiCall(endpoint, apiCallFn) {
    if (!this.isEnabled) return apiCallFn();
    
    this.startTiming(`api-${endpoint}`);
    
    if (apiCallFn.then) {
      // Handle promises
      return apiCallFn
        .then(result => {
          this.endTiming(`api-${endpoint}`);
          return result;
        })
        .catch(error => {
          this.endTiming(`api-${endpoint}`);
          throw error;
        });
    } else {
      // Handle synchronous calls
      const result = apiCallFn();
      this.endTiming(`api-${endpoint}`);
      return result;
    }
  }

  // Monitor page load performance
  monitorPageLoad() {
    if (!this.isEnabled) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          console.log('Page Load Performance:', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart
          });
        }
      }, 0);
    });
  }

  // Monitor largest contentful paint
  monitorLCP() {
    if (!this.isEnabled || !window.PerformanceObserver) return;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('Largest Contentful Paint:', lastEntry.startTime);
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', observer);
  }

  // Monitor first input delay
  monitorFID() {
    if (!this.isEnabled || !window.PerformanceObserver) return;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('First Input Delay:', entry.processingStart - entry.startTime);
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('fid', observer);
  }

  // Monitor cumulative layout shift
  monitorCLS() {
    if (!this.isEnabled || !window.PerformanceObserver) return;
    
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('Cumulative Layout Shift:', clsValue);
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('cls', observer);
  }

  // Disconnect all observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startTiming = (operation) => {
    performanceMonitor.startTiming(`${componentName}-${operation}`);
  };

  const endTiming = (operation) => {
    return performanceMonitor.endTiming(`${componentName}-${operation}`);
  };

  const monitorRender = (renderFn) => {
    return performanceMonitor.monitorComponentRender(componentName, renderFn);
  };

  return { startTiming, endTiming, monitorRender };
};

// HOC for monitoring component performance
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return function PerformanceMonitoredComponent(props) {
    const { monitorRender } = usePerformanceMonitor(componentName || WrappedComponent.name);
    
    return monitorRender(() => <WrappedComponent {...props} />);
  };
};

// Debounce utility for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Lazy loading utility
export const lazyLoad = (importFn, fallback = null) => {
  return React.lazy(() => {
    performanceMonitor.startTiming('lazy-load');
    return importFn().then(module => {
      performanceMonitor.endTiming('lazy-load');
      return module;
    });
  });
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (!performanceMonitor.isEnabled || !performance.memory) return;
  
  const memory = performance.memory;
  console.log('Memory Usage:', {
    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
  });
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;
  
  // This would typically integrate with webpack-bundle-analyzer
  console.log('Bundle analysis available in development mode');
};

// Performance optimization recommendations
export const getPerformanceRecommendations = () => {
  const recommendations = [];
  const metrics = performanceMonitor.getAllMetrics();
  
  Object.entries(metrics).forEach(([label, metric]) => {
    if (metric.duration > 1000) {
      recommendations.push(`Consider optimizing ${label} - took ${metric.duration.toFixed(2)}ms`);
    }
  });
  
  return recommendations;
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  if (performanceMonitor.isEnabled) {
    performanceMonitor.monitorPageLoad();
    performanceMonitor.monitorLCP();
    performanceMonitor.monitorFID();
    performanceMonitor.monitorCLS();
    
    // Monitor memory usage every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(monitorMemoryUsage, 30000);
    }
  }
};

export {
  performanceMonitor,
  PerformanceMonitor
};

export default {
  performanceMonitor,
  usePerformanceMonitor,
  withPerformanceMonitoring,
  debounce,
  throttle,
  lazyLoad,
  monitorMemoryUsage,
  analyzeBundleSize,
  getPerformanceRecommendations,
  initializePerformanceMonitoring
};
