// Next
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content="mercado-simples" />
          <meta name="author" content="Wallace Coimbra Dos Santos Martins" />
          <meta
            name="description"
            content="Saiba quanto está ficando sua compra em tempo real!"
          />

          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            rel="icon"
            type="icon"
            href="/shopping-cart-icon.png"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        <Main />
        <NextScript />
      </Html>
    );
  }
}
