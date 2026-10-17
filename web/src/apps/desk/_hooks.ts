// Small hooks shared by the desk screens.

import { useEffect, useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemo } from '../../demo/store';

// ?network=offline or ?network=online sets the demo connectivity flag (canvas tweak).
export function useNetworkParam(): void {
  const { dispatch } = useDemo();
  const [params] = useSearchParams();
  const net = params.get('network');
  useEffect(() => {
    if (net === 'offline') dispatch({ type: 'setOnline', online: false });
    else if (net === 'online') dispatch({ type: 'setOnline', online: true });
  }, [net, dispatch]);
}

const STATION = '(min-width: 1024px)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => undefined;
  const mq = window.matchMedia(STATION);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

// True when the desk station layout applies (1024px and wider).
export function useStation(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== 'undefined' && !!window.matchMedia ? window.matchMedia(STATION).matches : false),
    () => false,
  );
}
