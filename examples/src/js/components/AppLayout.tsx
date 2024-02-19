import * as React from 'react';

import Container from './reusable/Container';
import Page from './reusable/Page';
import ConnectButton from './ConnectButton';
import Form from './Form';

const AppLayout = () => (
  <Page.BlankPage>
    <Container.FlexRow className="justify-between items-center py-4 bg-brand px-4">
      <span className="text-xl text-white">ICP Ledger WebUI</span>
      <ConnectButton />
    </Container.FlexRow>
    <Container.PageContent className="py-8">
      <Form />
    </Container.PageContent>
  </Page.BlankPage>
);

export default AppLayout;
