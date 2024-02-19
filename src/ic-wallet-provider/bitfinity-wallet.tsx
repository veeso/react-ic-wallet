import * as React from 'react';

import { IIcWalletContext, IcWalletContext } from '../ic-wallet-context';
import { Action, reducer } from '../reducer';
import { useSafeDispatch } from '../utils/useSafeDispatch';
import { BitfinityWallet } from '../globals';
import { INITIAL_STATE, ProviderProps } from '../ic-wallet-provider';

export const BitfinityWalletProvider = ({ children }: ProviderProps) => {
  const [state, unsafeDispatch] = React.useReducer(reducer, INITIAL_STATE);
  const dispatch = useSafeDispatch(unsafeDispatch);

  console.log('state', state);

  const { status } = state;

  const synchronize = (dispatch: (action: Action) => void) => {
    const icWallet = bitfinityWallet();
    if (!icWallet) {
      dispatch({ type: 'IcWalletUnavailable' });
      return;
    }

    const fetchWalletState = async (): Promise<Action> => {
      const isConnected = await icWallet.isConnected();
      if (!isConnected) {
        return { type: 'IcWalletNotConnected' };
      }
      const account = await icWallet.getAccountID();
      const principal = (await icWallet.getPrincipal()).toString();

      return {
        type: 'IcWalletConnected',
        payload: { account, principal },
      };
    };

    fetchWalletState()
      .then((ev) => {
        dispatch(ev);
      })
      .catch((e) => {
        console.error("Couldn't fetch wallet state", e);
      });
  };

  const isInitializing = status === 'initializing';
  const isAvailable = status !== 'unavailable' && status !== 'initializing';

  React.useEffect(() => {
    if (isInitializing) {
      synchronize(dispatch);
    }
  }, [dispatch, isInitializing]);

  const connect = React.useCallback(() => {
    if (!isAvailable) {
      console.warn(
        '`connect` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
      );
      return Promise.resolve(null);
    }
    const icWallet = bitfinityWallet();
    if (!icWallet) {
      return Promise.resolve(null);
    }
    // connect
    icWallet
      .requestConnect()
      .then(() => {
        synchronize(dispatch);
      })
      .catch((e) => {
        console.error("Couldn't connect to wallet", e);
      });

    const fetchAccount = async (): Promise<{
      account: string;
      principal: string;
    } | null> => {
      const isConnected = await icWallet.isConnected();
      if (!isConnected) {
        return null;
      }
      const account = await icWallet.getAccountID();
      const principal = (await icWallet.getPrincipal()).toString();
      return { account, principal };
    };

    return fetchAccount();
  }, [dispatch, isAvailable]);

  const disconnect = React.useCallback(async () => {
    if (!isAvailable) {
      console.warn(
        '`disconnect` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
      );
      return Promise.resolve(false);
    }
    const icWallet = bitfinityWallet();
    if (!icWallet) {
      return Promise.resolve(false);
    }

    try {
      await icWallet.disconnect();
      dispatch({ type: 'IcWalletNotConnected' });
      return true;
    } catch (e) {
      console.error("Couldn't disconnect from wallet", e);
      return false;
    }
  }, [dispatch, isAvailable]);

  const createActor = React.useCallback(
    (canisterId: string, interfaceFactory: any, host?: string) => {
      if (!isAvailable) {
        console.warn(
          '`createActor` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
        );
        return Promise.resolve(null);
      }
      const icWallet = bitfinityWallet();
      if (!icWallet) {
        return Promise.resolve(null);
      }
      return icWallet.createActor({ canisterId, interfaceFactory, host });
    },
    [isAvailable],
  );

  const getBalance = React.useCallback(() => {
    if (!isAvailable) {
      console.warn(
        '`getBalance` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
      );
      return Promise.resolve(null);
    }
    const icWallet = bitfinityWallet();
    if (!icWallet) {
      return Promise.resolve(null);
    }
    const getUserAssets = async () => {
      return (await icWallet.getUserAssets()).map((asset) => {
        return {
          amount: asset.balance,
          canisterId: asset.canisterInfo.canisterId,
          decimals: asset.decimals,
          fee: asset.fee,
          logo: asset.logo,
          name: asset.name,
          standard: asset.standard,
          symbol: asset.symbol,
        };
      });
    };

    return getUserAssets();
  }, [isAvailable]);

  const value: IIcWalletContext = React.useMemo(
    () => ({
      ...state,
      connect,
      disconnect,
      createActor,
      getBalance,
    }),
    [state, connect, disconnect, createActor, getBalance],
  );
  return (
    <IcWalletContext.Provider value={value}>
      {children}
    </IcWalletContext.Provider>
  );
};

export const bitfinityWallet = (): BitfinityWallet | undefined => {
  return window.ic && (window.ic.bitfinityWallet || window.ic.infinityWallet);
};
