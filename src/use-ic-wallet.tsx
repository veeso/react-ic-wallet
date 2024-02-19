import * as React from 'react';

import { IcWalletContext } from './ic-wallet-context';

/**
 * Use this hook to access the IcWallet context
 */
export const useIcWallet = () => {
  const context = React.useContext(IcWalletContext);

  if (!context) {
    throw new Error('useIcWallet must be used within an `IcWalletProvider`');
  }

  return context;
};

/**
 * Use this hook to access the IcWallet context when it is connected
 */
export const useConnectedIcWallet = () => {
  const context = useIcWallet();

  if (context.status !== 'connected') {
    throw new Error('IcWallet must be connected to use this hook');
  }

  return context;
};
