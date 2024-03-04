import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './App';
import { IcWalletProvider, WalletProvider } from 'react-ic-wallet';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <React.StrictMode>
    <IcWalletProvider provider={WalletProvider.Dfinity}>
      <App />
    </IcWalletProvider>
  </React.StrictMode>,
);
