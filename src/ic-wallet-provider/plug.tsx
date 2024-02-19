import * as React from 'react';

import { IIcWalletContext, IcWalletContext } from '../ic-wallet-context';
import { Action, reducer } from '../reducer';
import { useSafeDispatch } from '../utils/useSafeDispatch';
import { PlugWallet } from '../globals';
import { INITIAL_STATE } from '../ic-wallet-provider';

export const PlugWalletProvider = (props: any) => {
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
          accounts: [icWallet.accountId],
          principal: icWallet.principalId,
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
        '`enable` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
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
      principal: string;
    } | null> => {
      const isConnected = await icWallet.isConnected();
      if (!isConnected || !icWallet.accountId || !icWallet.principalId) {
        return null;
      }
      const account = icWallet.accountId;
      const principal = icWallet.principalId;
      return { account, principal };
    };

    return fetchAccount();
  }, [dispatch]);

  const disconnect = React.useCallback(() => {
    if (!isAvailable) {
      console.warn(
        '`enable` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
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
  }, [dispatch]);

  const createActor = React.useCallback(
    (canisterId: string, interfaceFactory: any, host?: string) => {
      if (!isAvailable) {
        console.warn(
          '`enable` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
        );
        return Promise.resolve(null);
      }
      const icWallet = plugWallet();
      if (!icWallet) {
        return Promise.resolve(null);
      }
      return icWallet.createActor(canisterId, interfaceFactory, host);
    },
    [],
  );

  const getBalance = React.useCallback(() => {
    if (!isAvailable) {
      console.warn(
        '`enable` method has been called while IcWallet is not available or synchronising. Nothing will be done in this case.',
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
  }, []);

  const value: IIcWalletContext = React.useMemo(
    () => ({
      ...state,
      connect,
      disconnect,
      createActor,
      getBalance,
    }),
    [connect],
  );
  return <IcWalletContext.Provider value={value} {...props} />;
};

export const plugWallet = (): PlugWallet | undefined => {
  return window.ic && window.ic.plug;
};
