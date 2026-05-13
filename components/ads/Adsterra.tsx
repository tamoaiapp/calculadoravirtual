import Script from 'next/script'

const KEYS = {
  native: '4909e551c559a73ffee06971ca1e4f02',
  b320x50: '6a939e99b78f0af26229c6f13a70d69f',
  b300x250: '8e012463df9f400a4b50fdedf6f44b99',
  b728x90: 'abdb515f24f934804bf5f01e9bd81e7f',
  b160x600: 'f9b716ed8532093c23f829959e7d7ea3',
}

function srcDoc(key: string, width: number, height: number) {
  return `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script type="text/javascript">atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script></body></html>`
}

function Banner({ adKey, width, height }: { adKey: string; width: number; height: number }) {
  return (
    <iframe
      title="Anúncio"
      width={width}
      height={height}
      srcDoc={srcDoc(adKey, width, height)}
      style={{ border: 0, display: 'block', overflow: 'hidden', margin: '0 auto', maxWidth: '100%' }}
      scrolling="no"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
    />
  )
}

export function AdsterraLeaderboard728() {
  return <Banner adKey={KEYS.b728x90} width={728} height={90} />
}

export function AdsterraMobile320() {
  return <Banner adKey={KEYS.b320x50} width={320} height={50} />
}

export function AdsterraRectangle300() {
  return <Banner adKey={KEYS.b300x250} width={300} height={250} />
}

export function AdsterraSkyscraper160() {
  return <Banner adKey={KEYS.b160x600} width={160} height={600} />
}

export function AdsterraNative() {
  return (
    <div className="ad-native-wrapper" style={{ margin: '32px auto', maxWidth: 1200 }}>
      <Script
        src={`https://pl29431124.profitablecpmratenetwork.com/${KEYS.native}/invoke.js`}
        strategy="afterInteractive"
        async
        data-cfasync="false"
      />
      <div id={`container-${KEYS.native}`} />
    </div>
  )
}

export function AdsterraResponsiveLeaderboard() {
  return (
    <div className="ad-leaderboard-wrapper">
      <div className="ad-desktop-only">
        <AdsterraLeaderboard728 />
      </div>
      <div className="ad-mobile-only">
        <AdsterraMobile320 />
      </div>
    </div>
  )
}
