// React binding for the demo state. Screens call useDemo() for state plus dispatch.

import type { Dispatch, ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';
import type { DemoAction, DemoState } from './state';
import { initialState, reducer } from './state';

const Ctx = createContext<{ state: DemoState; dispatch: Dispatch<DemoAction> } | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo() {
  const value = useContext(Ctx);
  if (!value) throw new Error('useDemo must be used inside DemoProvider');
  return value;
}
