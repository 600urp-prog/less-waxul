import { createContext, useContext, ReactNode } from 'react';
import { useSurebets } from '@/hooks/use-surebets';
import { useHistory } from '@/hooks/use-history';
import { useEffect } from 'react';

type SurebetContextType = ReturnType<typeof useSurebets> & {
  history: ReturnType<typeof useHistory>;
};

const SurebetContext = createContext<SurebetContextType | null>(null);

export function SurebetProvider({ children }: { children: ReactNode }) {
  const surebetState = useSurebets();
  const history = useHistory();

  useEffect(() => {
    surebetState.registerOnScanComplete(history.reload);
  }, [surebetState.registerOnScanComplete, history.reload]);

  return (
    <SurebetContext.Provider value={{ ...surebetState, history }}>
      {children}
    </SurebetContext.Provider>
  );
}

export function useSurebetContext() {
  const ctx = useContext(SurebetContext);
  if (!ctx) throw new Error('useSurebetContext must be used within SurebetProvider');
  return ctx;
}
