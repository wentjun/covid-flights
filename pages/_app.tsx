import 'mapbox-gl/dist/mapbox-gl.css';
import { AppProps } from 'next/app';
import { Provider as StyletronProvider, DebugEngine } from 'styletron-react';
import { Client, Server } from 'styletron-engine-atomic';
import { BaseProvider, LightTheme } from 'baseui';

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
    <BaseProvider theme={LightTheme}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </BaseProvider>
  </StyletronProvider>
);

export default MyApp;
