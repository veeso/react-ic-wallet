# React IC Wallet

[![NPM](https://img.shields.io/npm/v/react-ic-wallet.svg)](https://www.npmjs.com/package/react-ic-wallet)
[![CI](https://github.com/veeso/react-ic-wallet/actions/workflows/build_test.yml/badge.svg)](https://github.com/veeso/react-ic-wallet/actions/workflows/build_test.yml)

React IC Wallet is a Simplistic Context provider in order to manage Internet Computer wallets in the browser.
It is heavily inspired by [Metamask react](https://www.npmjs.com/package/metamask-react).

## Supported wallets

Currently, **React-ic-wallet** supports the following browser wallets:

- [Bitfinity Wallet](https://wallet.bitfinity.network/)
- [Plug](https://plugwallet.ooo/)

## Usage

### Wrap your application

Wrap your application around the **IcWalletProvider**

```tsx
import { IcWalletProvider } from 'react-ic-wallet';

<IcWalletProvider>
  <App />
</IcWalletProvider>
```

### Use a specific wallet

```tsx
import { IcWalletProvider, WalletProvider } from 'react-ic-wallet';

<IcWalletProvider provider={WalletProvider.Bitfinity}>
  <App />
</IcWalletProvider>
```

### Create a component to handle the connection

```tsx
import * as React from 'react';
import { useIcWallet } from 'react-ic-wallet';

import Logo from './ConnectButton/Logo';
import Button from './reusable/Button';
import Container from './reusable/Container';

const ConnectButton = () => {
  const { status, connect, disconnect, account, principal } = useIcWallet();

  const disabled = ['initializing', 'unavailable', 'connecting'].includes(
    status,
  );

  React.useEffect(() => {
    console.log('status from ctx', status);
  }, [status]);

  const onClick = () => {
    if (status === 'notConnected') {
      return connect();
    } else if (status === 'connected') {
      return disconnect();
    }
    return undefined;
  };

  const text = () => {
    if (status === 'initializing') return 'Initializing...';
    if (status === 'unavailable') return 'IC Wallet not available';
    if (status === 'notConnected') return 'Connect to IC';
    if (status === 'connecting') return 'Connecting...';
    if (status === 'connected') return principal;
    return undefined;
  };

  return (
    <Container.FlexRow className="items-center gap-8">
      <Button.Alternative
        className="my-0 !mb-0"
        onClick={onClick}
        disabled={disabled}
      >
        <Logo className="inline w-[32px] mr-2" />
        {text()}
      </Button.Alternative>
    </Container.FlexRow>
  );
};

export default ConnectButton;
```

### Create actor to interact with canisters

```tsx
import * as React from 'react';
import { ActorMethod, ActorSubclass } from '@dfinity/agent';
import { useIcWallet } from 'react-ic-wallet';

import { icpLedgerIdlFactory } from './IcpLedger';

interface Context {
  icpLedger?: ActorSubclass<Record<string, ActorMethod>>;
}

export const AgentContext = React.createContext<Context>({
  icpLedger: undefined,
});

export const icpLedgerIdlFactory = ({ IDL: IDL }) => {
  ...
  return IDL.Service({
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_fee: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_metadata: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))],
      ['query'],
    ),
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_supported_standards: IDL.Func(
      [],
      [IDL.Vec(TokenExtension)],
      ['query'],
    ),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArg], [Result_5], []),
    icrc2_allowance: IDL.Func([AllowanceArgs], [Allowance], ['query']),
    icrc2_approve: IDL.Func([ApproveArgs], [Result_6], []),
    icrc2_transfer_from: IDL.Func([TransferFromArgs], [Result_7], []),
  });
}

const AgentContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [icpLedger, setIcpLedger] =
    React.useState<ActorSubclass<Record<string, ActorMethod>>>();
  const { createActor, status } = useIcWallet();

  React.useEffect(() => {
    if (status === 'connected') {
      createActor('ryjl3-tyaaa-aaaaa-aaaba-cai', icpLedgerIdlFactory)
        .then((actor) => {
          if (actor) {
            setIcpLedger(actor);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [status]);

  return (
    <AgentContext.Provider
      value={{
        icpLedger,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export default AgentContextProvider;
```

### Access methods once connected

```tsx
import * as React from 'react';
import { useIcWallet } from 'react-ic-wallet';

const Header = () => {
  const { icpLedger } = React.useContext(AgentContext);
  const { principal } = useConnectedIcWallet();
  const [balance, setBalance] = React.useState<string>('0');

  React.useEffect(() => {
    if (icpLedger) {
      icpLedger
        .icrc1_balance_of({
          owner: Principal.fromText(principal),
          subaccount: [],
        })
        .then((balance) => {
          setBalance((balance as bigint).toString());
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [icpLedger]);

  return (
    <Container.FlexCols>
      <span>User balance (ICP): {balance}</span>
    </Container.FlexCols>
  );
};

export default Header;

```

### Example

Find more in the example in the `examples/` directory, where we use the ic wallet context provider to query the ICP ledger canister.

## License

react-ic-wallet is licensed under MIT.

See full license [HERE](./LICENSE).
