import * as React from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';

import { IIcWalletContext, IcWalletContext } from '../ic-wallet-context';
import { Action, reducer } from '../reducer';
import { useSafeDispatch } from '../utils/useSafeDispatch';
import { INITIAL_STATE, ProviderProps } from '../ic-wallet-provider';
import { Actor, HttpAgent } from '@dfinity/agent';

export const DfinityWalletProvider = ({ children }: ProviderProps) => {
  const [state, unsafeDispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [authClient, setAuthClient] = React.useState<AuthClient>();
  const dispatch = useSafeDispatch(unsafeDispatch);

  const { status } = state;

  const synchronize = (dispatch: (action: Action) => void) => {
    if (!authClient) {
      dispatch({ type: 'IcWalletUnavailable' });
      return;
    }

    const fetchWalletState = async (): Promise<Action> => {
      const isConnected = await authClient.isAuthenticated();
      if (!isConnected) {
        return { type: 'IcWalletNotConnected' };
      }
      const identity = await authClient.getIdentity();

      return {
        type: 'IcWalletConnected',
        payload: { account: null, principal: identity.getPrincipal() },
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
    if (isInitializing && !authClient) {
      AuthClient.create()
        .then((client) => {
          setAuthClient(client);
        })
        .catch((e) => {
          console.error("Couldn't create auth client", e);
        });
    } else if (isInitializing && authClient) {
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
    if (!authClient) {
      return Promise.resolve(null);
    }

    // connect
    authClient
      .login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          synchronize(dispatch);
        },
      })
      .then(() => {})
      .catch((e) => {
        console.error("Couldn't connect to wallet", e);
      });

    const fetchAccount = async (): Promise<{
      account: string | null;
      principal: Principal;
    } | null> => {
      const isConnected = await authClient.isAuthenticated();
      if (!isConnected) {
        return null;
      }
      const identity = authClient.getIdentity();
      return { account: null, principal: identity.getPrincipal() };
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
    if (!authClient) {
      return Promise.resolve(false);
    }

    try {
      await authClient.logout();
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

      if (!authClient) {
        return Promise.resolve(null);
      }
      const identity = authClient.getIdentity();
      const agent = new HttpAgent({ identity, host });
      return Promise.resolve(
        Actor.createActor(interfaceFactory, { agent, canisterId }),
      );
    },
    [isAvailable],
  );

  const getBalance = React.useCallback(() => {
    return Promise.resolve(null);
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
