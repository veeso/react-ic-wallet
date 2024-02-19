import * as React from 'react';

import { IcWalletState } from './ic-wallet-context';
import {
  BitfinityWalletProvider,
  bitfinityWallet,
} from './ic-wallet-provider/bitfinity-wallet';
import { PlugWalletProvider, plugWallet } from './ic-wallet-provider/plug';
import { UnavailableWallet } from './ic-wallet-provider/unavailable-wallet';

export const INITIAL_STATE: IcWalletState = {
  status: 'initializing',
  principal: null,
  account: null,
};

export interface ProviderProps {
  children: React.ReactNode;
}

export const IcWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const maybeBitfinityWallet = bitfinityWallet();
  const maybePlugWallet = plugWallet();

  if (maybeBitfinityWallet) {
    return <BitfinityWalletProvider>{children}</BitfinityWalletProvider>;
  }

  if (maybePlugWallet) {
    return <PlugWalletProvider>{children}</PlugWalletProvider>;
  }

  // otherwise return unavailable wallet
  return <UnavailableWallet>{children}</UnavailableWallet>;
};
