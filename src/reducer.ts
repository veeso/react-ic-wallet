import { IcWalletState } from './ic-wallet-context';

type IcWalletUnavailable = {
  type: 'IcWalletUnavailable';
};
type IcWalletNotConnected = {
  type: 'IcWalletNotConnected';
};
type IcWalletConnected = {
  type: 'IcWalletConnected';
  payload: {
    accounts: string[];
    principal: string;
  };
};
type IcWalletConnecting = {
  type: 'IcWalletConnecting';
};
type PermissionRejected = {
  type: 'IcWalletPermissionRejected';
};
type AccountsChanged = {
  type: 'IcWalletAccountsChanged';
  payload: string[];
};

export type Action =
  | IcWalletUnavailable
  | IcWalletNotConnected
  | IcWalletConnected
  | IcWalletConnecting
  | PermissionRejected
  | AccountsChanged;

export function reducer(state: IcWalletState, action: Action): IcWalletState {
  switch (action.type) {
    case 'IcWalletUnavailable':
      return {
        principal: null,
        account: null,
        status: 'unavailable',
      };
    case 'IcWalletNotConnected':
      return {
        principal: null,
        account: null,
        status: 'not-connected',
      };
    case 'IcWalletConnected':
      return {
        account: action.payload.accounts[0],
        principal: action.payload.principal,
        status: 'connected',
      };
    case 'IcWalletConnecting':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid state transition from "${state.status}" to "connecting". Please, file an issue.`,
        );
        return state;
      }
      return {
        ...state,
        account: null,
        principal: null,
        status: 'connecting',
      };
    case 'IcWalletPermissionRejected':
      if (state.status === 'initializing' || state.status === 'unavailable') {
        console.warn(
          `Invalid state transition from "${state.status}" to "connecting". Please, file an issue.`,
        );
        return state;
      }
      return {
        ...state,
        account: null,
        principal: null,
        status: 'not-connected',
      };
    case 'IcWalletAccountsChanged':
      if (state.status !== 'connected') {
        console.warn(
          `Invalid accounts change in "${state.status}". Please, file an issue.`,
        );
        return state;
      }
      if (action.payload.length === 0) {
        return {
          ...state,
          account: null,
          principal: null,
          status: 'not-connected',
        };
      }
      return {
        ...state,
        account: action.payload[0],
      };
    // no default
  }
}
