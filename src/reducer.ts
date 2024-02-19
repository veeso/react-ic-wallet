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
    account: string;
    principal: string;
  };
};
type IcWalletConnecting = {
  type: 'IcWalletConnecting';
};

export type Action =
  | IcWalletUnavailable
  | IcWalletNotConnected
  | IcWalletConnected
  | IcWalletConnecting;

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
        status: 'notConnected',
      };
    case 'IcWalletConnected':
      return {
        account: action.payload.account,
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
    // no default
  }
}
