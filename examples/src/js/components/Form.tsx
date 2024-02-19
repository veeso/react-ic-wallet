import * as React from 'react';
import { useIcWallet } from 'react-ic-wallet';

import Container from './reusable/Container';
import Alerts from './reusable/Alerts';
import Header from './Form/Header';
import AgentContextProvider from '../web3/AgentContext';

const Form = () => {
  const { status } = useIcWallet();

  const content =
    status === 'connected' ? (
      <Container.FlexCols className="gap-8">
        <Header />
      </Container.FlexCols>
    ) : (
      <Container.Container>
        <Alerts.Warning>
          Connect to your IC wallet to access the DAPP
        </Alerts.Warning>
      </Container.Container>
    );

  return (
    <AgentContextProvider>
      <Container.Container>{content}</Container.Container>
    </AgentContextProvider>
  );
};

export default Form;
