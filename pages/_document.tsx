import Document, { Head, Main, NextScript } from 'next/document';
import { Provider as StyletronProvider } from 'styletron-react';
import { Server, Sheet } from 'styletron-engine-atomic';
import { styletron } from './_app';

class MyDocument extends Document<{stylesheets: Sheet[]}> {
  static getInitialProps(props: any) {
    // eslint-disable-next-line no-shadow
    const page = props.renderPage((App: any) => (props: any) => (
      <StyletronProvider value={styletron}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <App {...props} />
      </StyletronProvider>
    ));
    const stylesheets = (styletron as Server).getStylesheets() || [];
    return { ...page, stylesheets };
  }

  render() {
    return (
      <html lang='en'>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className='_styletron_hydrate_'
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
            />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
