import { BaseProvider, DarkTheme } from 'baseui';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AppProps } from 'next/app';
import { Client, Server } from 'styletron-engine-atomic';
import { DebugEngine, Provider as StyletronProvider } from 'styletron-react';
import './index.css';

const getHydrateClass = () => (
  document.getElementsByClassName('_styletron_hydrate_') as HTMLCollectionOf<HTMLStyleElement>
);

const styletron = typeof window === 'undefined'
  ? new Server()
  : new Client({
    hydrate: getHydrateClass(),
  });

const debug = process.env.NODE_ENV === 'production' ? undefined : new DebugEngine();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
    <BaseProvider theme={DarkTheme}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </BaseProvider>
  </StyletronProvider>
);

export default MyApp;
