import { useState, useRef, useCallback } from 'react';

/**
 * Pull-to-refresh hook for mobile native feel.
 * Returns { containerProps, PullIndicator } to spread on the scroll container.
 */
export function usePullToRefresh(onRefresh) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const pullDistance = useRef(0);
  const THRESHOLD = 65;

  const onTouchStart = useCallback((e) => {
    const el = e.currentTarget;
    if (el.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      pullDistance.current = Math.min(delta, THRESHOLD * 1.5);
      setPulling(pullDistance.current > 10);
    }
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (pullDistance.current >= THRESHOLD) {
      setRefreshing(true);
      setPulling(false);
      await onRefresh();
      setRefreshing(false);
    } else {
      setPulling(false);
    }
    startY.current = null;
    pullDistance.current = 0;
  }, [onRefresh]);

  return {
    containerProps: { onTouchStart, onTouchMove, onTouchEnd },
    pulling,
    refreshing,
  };
}