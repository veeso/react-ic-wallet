import { ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import * as React from 'react';

type IcWalletInitializing = {
  principal: null;
  account: null;
  status: 'initializing';
};

type IcWalletUnavailable = {
  principal: null;
  account: null;
  status: 'unavailable';
};

type IcWalletNotConnected = {
  principal: null;
  account: null;
  status: 'notConnected';
};

type IcWalletConnecting = {
  principal: null;
  account: null;
  status: 'connecting';
};

type IcWalletConnected = {
  principal: Principal;
  account: string;
  status: 'connected';
};

export type IcWalletState =
  | IcWalletInitializing
  | IcWalletUnavailable
  | IcWalletNotConnected
  | IcWalletConnecting
  | IcWalletConnected;

export type IIcWalletContext = IcWalletState & {
  /**
   * Connect the application to the availble Ic Wallet
   * @returns current Account and principal, `null` if method not ready to be used
   */
  connect: () => Promise<{
    account: string;
    principal: Principal;
  } | null>;

  /**
   * Disconnect the application from the Ic Wallet
   * @returns `true` if disconnected, `false` if method not ready to be used
   */
  disconnect: () => Promise<boolean>;

  /**
   * Create a actor to interact with a canister
   * @param canisterId
   * @param interfaceFactory
   * @param host
   * @returns the actor to interact with the canister, `null` if the method not ready to be used
   */
  createActor(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
    host?: string,
  ): Promise<ActorSubclass<unknown> | null>;

  /**
   * Get user balance
   * @returns the user balance, `null` if the method not ready to be used
   */
  getBalance(): Promise<
    | {
        amount: string;
        canisterId: string;
        decimals: number;
        fee: string;
        logo: string;
        name: string;
        standard: string;
        symbol: string;
      }[]
    | null
  >;
};

export const IcWalletContext = React.createContext<
  IIcWalletContext | undefined
>(undefined);
