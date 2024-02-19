import { ActorMethod, ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';

declare global {
  interface Window {
    ic?: Ic;
  }
}

interface Ic {
  bitfinityWallet?: BitfinityWallet;
  infinityWallet?: BitfinityWallet;
  plug?: PlugWallet;
}

interface BitfinityWallet {
  disconnect: () => Promise<boolean>;
  requestConnect: (
    whitelist?: string[],
    timeout?: number,
  ) => Promise<{ toDer(): ArrayBuffer }>;
  isConnected: () => Promise<boolean>;
  getPrincipal: () => Promise<{
    toString(): string;
    isAnonymous(): boolean;
    toUint8Array(): Uint8Array;
  }>;
  getAccountID: () => Promise<string>;
  getUserAssets: () => Promise<
    {
      balance: string;
      canisterInfo: {
        canisterId: string;
        subnetId: string;
        wasmHash: string;
      };
      decimals: number;
      fee: string;
      hide: boolean;
      id: string;
      index_canister: string;
      isTestToken: boolean;
      logo: string;
      minter_canister: string;
      name: string;
      standard: string;
      symbol: string;
    }[]
  >;
  createActor: (args: {
    canisterId: string;
    interfaceFactory: IDL.InterfaceFactory;
    host?: string;
  }) => Promise<ActorSubclass<Record<string, ActorMethod>>>;
}

interface PlugWallet {
  accountId?: string;
  principalId?: string;
  disconnect: () => Promise<void>;
  requestConnect: (
    whitelist?: string[],
    timeout?: number,
    host?: string,
  ) => Promise<{ derKey: { data: number[] }; rawKey: { data: number[] } }>;
  isConnected: () => Promise<boolean>;
  requestBalance: () => Promise<
    {
      amount: number;
      canisterId: string;
      decimals: number;
      fee: number;
      logo: string;
      name: string;
      standard: string;
      symbol: string;
    }[]
  >;
  createActor: (args: {
    canisterId: string;
    interfaceFactory: IDL.InterfaceFactory;
    host?: string;
  }) => Promise<ActorSubclass<Record<string, ActorMethod>>>;
}
