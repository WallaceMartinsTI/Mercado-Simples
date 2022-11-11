// Next
import type { AppProps } from "next/app";
import Head from "next/head";

// CSS
import "../styles/global.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mercado Simples</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
