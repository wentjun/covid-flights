import Document, { Head, Main, NextScript } from 'next/document';
import { Provider as StyletronProvider } from 'styletron-react';
import { Server, Sheet } from 'styletron-engine-atomic';
import { styletron } from './_app';

class MyDocument extends Document<{stylesheets: Sheet[]}> {
  static getInitialProps(props: any) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const page = props.renderPage((App: any) => (_props: any) => (
      <StyletronProvider value={styletron}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <App {..._props} />
      </StyletronProvider>
    ));
    const stylesheets = (styletron as Server).getStylesheets() || [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
