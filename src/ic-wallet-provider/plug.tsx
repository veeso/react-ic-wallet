import * as React from 'react';
import { Principal } from '@dfinity/principal';

import { IIcWalletContext, IcWalletContext } from '../ic-wallet-context';
import { Action, reducer } from '../reducer';
import { useSafeDispatch } from '../utils/useSafeDispatch';
import { PlugWallet } from '../globals';
import { INITIAL_STATE, ProviderProps } from '../ic-wallet-provider';

export const PlugWalletProvider = ({ children }: ProviderProps) => {
  const [state, unsafeDispatch] = React.useReducer(reducer, INITIAL_STATE);
  const dispatch = useSafeDispatch(unsafeDispatch);

  const { status } = state;

  const synchronize = (dispatch: (action: Action) => void) => {
    const icWallet = plugWallet();
    if (!icWallet) {
      dispatch({ type: 'IcWalletUnavailable' });
      return;
    }

    const fetchWalletState = async (): Promise<Action> => {
      const isConnected = await icWallet.isConnected();
      if (!isConnected || !icWallet.accountId || !icWallet.principalId) {
        return { type: 'IcWalletNotConnected' };
      }

      return {
        type: 'IcWalletConnected',
        payload: {
          account: icWallet.accountId,
          principal: Principal.fromText(icWallet.principalId),
        },
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
    const icWallet = plugWallet();
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
      principal: Principal;
    } | null> => {
      const isConnected = await icWallet.isConnected();
      if (!isConnected || !icWallet.accountId || !icWallet.principalId) {
        return null;
      }
      const account = icWallet.accountId;
      const principal = Principal.fromText(icWallet.principalId);
      return { account, principal };
    };

    return fetchAccount();
  }, [dispatch, isAvailable]);

  const disconnect = React.useCallback(() => {
    if (!isAvailable) {
      console.warn(
        '`disconnect` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
      );
      return Promise.resolve(false);
    }
    const icWallet = plugWallet();
    if (!icWallet) {
      return Promise.resolve(false);
    }

    return icWallet
      .disconnect()
      .then(() => {
        dispatch({ type: 'IcWalletNotConnected' });
        return true;
      })
      .catch((e) => {
        console.error("Couldn't disconnect from wallet", e);
        return false;
      });
  }, [dispatch, isAvailable]);

  const createActor = React.useCallback(
    (canisterId: string, interfaceFactory: any, host?: string) => {
      if (!isAvailable) {
        console.warn(
          '`createActor` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
        );
        return Promise.resolve(null);
      }
      const icWallet = plugWallet();
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
    const icWallet = plugWallet();
    if (!icWallet) {
      return Promise.resolve(null);
    }
    const getUserAssets = async () => {
      return (await icWallet.requestBalance()).map((asset) => {
        return {
          amount: asset.amount.toString(),
          canisterId: asset.canisterId,
          decimals: asset.decimals,
          fee: asset.fee.toString(),
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

export const plugWallet = (): PlugWallet | undefined => {
  return window.ic && window.ic.plug;
};
