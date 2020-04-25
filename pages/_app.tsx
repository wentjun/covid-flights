import 'mapbox-gl/dist/mapbox-gl.css';
import { AppProps } from 'next/app';

// eslint-disable-next-line react/jsx-props-no-spreading
const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => <Component {...pageProps} />;

export default MyApp;
