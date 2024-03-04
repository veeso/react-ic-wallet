import * as React from 'react';

import { IcWalletState } from './ic-wallet-context';
import {
  BitfinityWalletProvider,
  bitfinityWallet,
} from './ic-wallet-provider/bitfinity-wallet';
import { PlugWalletProvider, plugWallet } from './ic-wallet-provider/plug';
import { DfinityWalletProvider } from './ic-wallet-provider/dfinity-wallet';

export const INITIAL_STATE: IcWalletState = {
  status: 'initializing',
  principal: null,
  account: null,
};

export enum WalletProvider {
  Bitfinity,
  Dfinity,
  Plug,
}

export interface ProviderProps {
  children: React.ReactNode;
  provider?: WalletProvider;
}

export const IcWalletProvider = ({ children, provider }: ProviderProps) => {
  const maybeBitfinityWallet = bitfinityWallet();
  const maybePlugWallet = plugWallet();

  // with provider
  if (provider === WalletProvider.Bitfinity) {
    return <BitfinityWalletProvider>{children}</BitfinityWalletProvider>;
  }

  if (provider === WalletProvider.Plug) {
    return <PlugWalletProvider>{children}</PlugWalletProvider>;
  }

  if (provider === WalletProvider.Dfinity) {
    return <DfinityWalletProvider>{children}</DfinityWalletProvider>;
  }

  // without provider
  if (maybeBitfinityWallet) {
    return <BitfinityWalletProvider>{children}</BitfinityWalletProvider>;
  }

  if (maybePlugWallet) {
    return <PlugWalletProvider>{children}</PlugWalletProvider>;
  }

  // otherwise return dfinity wallet
  return <DfinityWalletProvider>{children}</DfinityWalletProvider>;
};
