import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <title>StaffIQ</title>
        <meta name="description" content="StaffIQ — AI-powered academic hiring platform" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="antialiased noise-bg" style={{ backgroundColor: "#0a0a0f" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
