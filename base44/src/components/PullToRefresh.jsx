import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Wrap your page content with this component to get pull-to-refresh.
 * Usage:
 *   <PullToRefresh onRefresh={loadData}>
 *     <YourContent />
 *   </PullToRefresh>
 */
export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [pullY, setPullY] = React.useState(0);
  const startY = React.useRef(null);
  const containerRef = React.useRef(null);
  const THRESHOLD = 65;

  const handleTouchStart = (e) => {
    const container = containerRef.current;
    if (!container) return;
    if (container.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      const clamped = Math.min(delta * 0.5, THRESHOLD * 1.2);
      setPullY(clamped);
      setPulling(clamped > 10);
    }
  };

  const handleTouchEnd = async () => {
    if (pullY >= THRESHOLD * 0.5) {
      setRefreshing(true);
      setPulling(false);
      setPullY(0);
      await onRefresh?.();
      setRefreshing(false);
    } else {
      setPulling(false);
      setPullY(0);
    }
    startY.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(pulling || refreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ height: refreshing ? 48 : Math.max(0, pullY), transition: refreshing ? 'none' : 'height 0.1s' }}
        >
          <div className={`flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 shadow-md text-sm font-medium text-foreground ${refreshing ? 'opacity-100' : 'opacity-80'}`}>
            <RefreshCw className={`w-4 h-4 text-primary ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-xs">{refreshing ? 'Actualizando...' : 'Suelta para actualizar'}</span>
          </div>
        </div>
      )}
      <div style={{ transform: pulling ? `translateY(${pullY}px)` : 'none', transition: pulling ? 'none' : 'transform 0.2s ease' }}>
        {children}
      </div>
    </div>
  );
}