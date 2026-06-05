import { createContext, useContext, type ReactNode } from 'react';
import type { AssignedCloseuse } from '@/components/ProductForm';

const Ctx = createContext<AssignedCloseuse | null>(null);

export function AssignedCloseuseProvider({ value, children }: { value: AssignedCloseuse; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssignedCloseuse(): AssignedCloseuse | null {
  return useContext(Ctx);
}
