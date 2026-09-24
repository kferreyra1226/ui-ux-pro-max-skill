'use client';

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { AGE_GATE_COOKIE_MAX_AGE_SECONDS, AGE_GATE_STORAGE_KEY } from '@/lib/config';

/**
 * Age gate state.
 *
 * IMPORTANT - this is NOT age verification.
 * This screen records a self-declaration in a session cookie so cannabis content is not
 * rendered to someone who has not confirmed they are 21 or over. It proves nothing about
 * the visitor. It is not a replacement for compliant age and identity verification at
 * checkout or at final order handoff, which must be done by a vendor-backed service
 * server-side and by checking a valid government-issued photo ID in person.
 *
 * PRODUCTION INTEGRATION POINT - Age & identity verification:
 * Gate cannabis routes server-side (middleware) as well, so the markup is never sent to a
 * client that has not confirmed, and connect a real verification provider before checkout.
 */

type Confirmation = 'unknown' | 'confirmed' | 'declined';

interface AgeGateValue {
  state: Confirmation;
  /** True until the cookie has been read, so the gate does not flash for returning adults. */
  loading: boolean;
  confirm: () => void;
  decline: () => void;
  reset: () => void;
}

const AgeGateContext = createContext<AgeGateValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  // PRODUCTION: set this cookie from the server as HttpOnly so client script cannot forge it.
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function AgeGateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Confirmation>('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readCookie(AGE_GATE_STORAGE_KEY);
    if (stored === 'confirmed' || stored === 'declined') setState(stored);
    setLoading(false);
  }, []);

  const confirm = useCallback(() => {
    writeCookie(AGE_GATE_STORAGE_KEY, 'confirmed', AGE_GATE_COOKIE_MAX_AGE_SECONDS);
    setState('confirmed');
  }, []);

  const decline = useCallback(() => {
    // Declining is remembered only for this browser session.
    writeCookie(AGE_GATE_STORAGE_KEY, 'declined', 0);
    setState('declined');
  }, []);

  const reset = useCallback(() => {
    writeCookie(AGE_GATE_STORAGE_KEY, '', 0);
    setState('unknown');
  }, []);

  const value = useMemo(() => ({ state, loading, confirm, decline, reset }), [state, loading, confirm, decline, reset]);

  return <AgeGateContext.Provider value={value}>{children}</AgeGateContext.Provider>;
}

export function useAgeGate(): AgeGateValue {
  const ctx = useContext(AgeGateContext);
  if (!ctx) throw new Error('useAgeGate must be used inside AgeGateProvider');
  return ctx;
}
