import * as React from 'react';
import { ActorSubclass } from '@dfinity/agent';
import { useIcWallet } from 'react-ic-wallet';

import { IcpLedger, idlFactory } from './IcpLedger';

interface Context {
  icpLedger?: ActorSubclass<IcpLedger>;
}

export const AgentContext = React.createContext<Context>({
  icpLedger: undefined,
});

const AgentContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [icpLedger, setIcpLedger] = React.useState<ActorSubclass<IcpLedger>>();
  const { createActor, status } = useIcWallet();

  React.useEffect(() => {
    if (status === 'connected') {
      createActor('ryjl3-tyaaa-aaaaa-aaaba-cai', idlFactory)
        .then((actor) => {
          if (actor) {
            setIcpLedger(actor as ActorSubclass<IcpLedger>);
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
