import { Html, Head, Main, NextScript } from 'next/document'

import Script from 'next/script'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <meta charSet="utf-8" />
    <title>ProGuide - Digital Student Assistants for everyone</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta content="Digital Assistant, Student, Edtech" name="keywords"/>
    <meta content="A good mentor is worth 5 years of Blind Trial and Error - Get one now with a click" name="description"/>
    <link href="/pro+logo.png" rel="icon"/>
    <meta https-equiv="Content-Security-Policy" content="default-src *;" />
    <link href="/manifest.json" rel="manifest"/>
    <Script src="/appSW.js"></Script>
    <link href="/icon-192x192.png" rel="apple-touch-icon"/>
      </Head>
      <body style={{ paddingBottom:'100px'}}>
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossOrigin="anonymous" async></script>
      
      </body>
    </Html>
  )
}
