import * as React from 'react';
import { useConnectedIcWallet } from 'react-ic-wallet';

import { AgentContext } from '../../web3/AgentContext';
import Container from '../reusable/Container';
import { Principal } from '@dfinity/principal';

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
