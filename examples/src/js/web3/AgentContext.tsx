import * as React from 'react';
import { ActorMethod, ActorSubclass } from '@dfinity/agent';
import { useIcWallet } from 'react-ic-wallet';

import { icpLedgerIdlFactory } from './IcpLedger';

interface Context {
  icpLedger?: ActorSubclass<Record<string, ActorMethod>>;
}

export const AgentContext = React.createContext<Context>({
  icpLedger: undefined,
});

const AgentContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [icpLedger, setIcpLedger] =
    React.useState<ActorSubclass<Record<string, ActorMethod>>>();
  const { createActor, status } = useIcWallet();

  React.useEffect(() => {
    if (status === 'connected') {
      createActor('ryjl3-tyaaa-aaaaa-aaaba-cai', icpLedgerIdlFactory)
        .then((actor) => {
          if (actor) {
            setIcpLedger(actor);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [status]);

  return (
    <AgentContext.Provider
      value={{
        icpLedger,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export default AgentContextProvider;
