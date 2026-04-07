export interface ChannelMeta {
  name: string
  image: string
}

export const CHANNEL_META: Record<string, ChannelMeta> = {
  'espnpremium': { name: 'ESPN Premium', image: 'https://bestleague.world/img/espnpr.webp' },
  'espn':        { name: 'ESPN 1',        image: 'https://bestleague.world/img/espn.webp' },
  'espn2':       { name: 'ESPN 2',        image: 'https://bestleague.world/img/espn2.webp' },
  'espn3':       { name: 'ESPN 3',        image: 'https://bestleague.world/img/espn3.webp' },
  'fox1ar':      { name: 'FOX Sports 1',  image: 'https://bestleague.world/img/foxnew.png' },
  'fox2ar':      { name: 'FOX Sports 2',  image: 'https://bestleague.world/img/foxnew2.png' },
  'fox3ar':      { name: 'FOX Sports 3',  image: 'https://bestleague.world/img/foxnew3.png' },
  'tycsports':        { name: 'TyC Sports',       image: 'https://bestleague.world/img/tyc.webp' },
  'tycinternacional': { name: 'TyC Internacional', image: 'https://bestleague.world/img/tyc.webp' },
  'dsports':     { name: 'DSports',      image: 'https://bestleague.world/img/dsports.webp' },
  'dsports2':    { name: 'DSports 2',    image: 'https://bestleague.world/img/dsports2.webp' },
  'dsportsplus': { name: 'DSports Plus', image: 'https://bestleague.world/img/dsportsplus.webp' },
  'tntsports':   { name: 'TNT Sports',   image: 'https://bestleague.world/img/tntar.svg' },
  'futv':        { name: 'FUTV',         image: 'https://bestleague.world/img/futv.webp' },
  'telefe':      { name: 'Telefe',       image: 'https://bestleague.world/img/telefe.webp' },
}

export function getChannelMeta(streamId: string, fallbackName: string) {
  const meta = CHANNEL_META[streamId]
  if (meta) {
    return meta
  }
  return {
    name: fallbackName,
    image: `https://bestleague.world/img/${streamId}.png` // Fallback basico
  }
}
