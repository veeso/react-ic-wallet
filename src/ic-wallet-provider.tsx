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

const IcWalletProvider = (props: any) => {
  const maybeBitfinityWallet = bitfinityWallet();
  const maybePlugWallet = plugWallet();

  if (maybeBitfinityWallet) {
    return <BitfinityWalletProvider {...props} />;
  }

  if (maybePlugWallet) {
    return <PlugWalletProvider {...props} />;
  }

  // otherwise return unavailable wallet
  return <UnavailableWallet {...props} />;
};

export default IcWalletProvider;
