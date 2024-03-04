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
    if (status === 'connected') return principal.toString();
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
