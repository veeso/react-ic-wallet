import * as React from 'react';

import { IIcWalletContext, IcWalletContext } from '../ic-wallet-context';
import { ProviderProps } from '../ic-wallet-provider';

export const UnavailableWallet = ({ children }: ProviderProps) => {
  const connect = React.useCallback(() => {
    return Promise.resolve(null);
  }, []);

  const disconnect = React.useCallback(() => {
    return Promise.resolve(false);
  }, []);

  const createActor = React.useCallback(() => {
    return Promise.resolve(null);
  }, []);

  const getBalance = React.useCallback(() => {
    return Promise.resolve(null);
  }, []);

  const value: IIcWalletContext = React.useMemo(
    () => ({
      ...{
        status: 'unavailable',
        principal: null,
        account: null,
      },
      connect,
      disconnect,
      createActor,
      getBalance,
    }),
    [connect, disconnect, createActor, getBalance],
  );
  return (
    <IcWalletContext.Provider value={value}>
      {children}
    </IcWalletContext.Provider>
  );
};
