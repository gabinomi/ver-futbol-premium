export const _p = ['htt', 'ps:', '//', 'tvl', 'ibr', '3.c', 'om', '/html/fl/?get=']
export const BASE_JW = _p.slice(0, 3).join('') + _p.slice(3, 7).join('') + _p[7]

export function _k(a: string, b: string, c: string) { return (a || '') + (b || '') + (c || '') }

export interface Canal {
  nombre: string
  enlace: string
  img: string
  hd: string | null
  hidden?: boolean
}

export const CANALES: Canal[] = [
  { nombre: 'ESPN Premium', enlace: 'https://streamtpnew.com/global1.php?stream=espnpremium', img: 'https://bestleague.world/img/espnpr.webp',     hd: _k('Rm94','X1Nw','b3J0c19QcmVtaXVuX0hE') },
  { nombre: 'ESPN 1',       enlace: 'https://streamtpnew.com/global1.php?stream=espn',        img: 'https://bestleague.world/img/espn.webp',        hd: _k('RVNQ','TjJI','RA') },
  { nombre: 'ESPN 2',       enlace: 'https://streamtpnew.com/global1.php?stream=espn2',       img: 'https://bestleague.world/img/espn2.webp',       hd: _k('RVNQ','TjJf','QXJn') },
  { nombre: 'ESPN 3',       enlace: 'https://streamtpnew.com/global1.php?stream=espn3',       img: 'https://bestleague.world/img/espn3.webp',       hd: _k('RVNQ','TjM','') },
  { nombre: 'ESPN 4',       enlace: 'https://streamtpnew.com/global1.php?stream=espn4',       img: 'https://bestleague.world/img/espn4.webp',       hd: _k('RVNQ','Tkh','E') },
  { nombre: 'ESPN 5',       enlace: 'https://streamtpnew.com/global1.php?stream=espn5',       img: 'https://bestleague.world/img/espn5.webp',       hd: _k('RVNQ','TjQ','=') },
  { nombre: 'ESPN 1 CO',    enlace: 'https://streamtpnew.com/global1.php?stream=espn',        img: 'https://bestleague.world/img/espn.webp',        hd: _k('RVNQ','Tl9V','WQ=='), hidden: true },
  { nombre: 'ESPN 2 CO',    enlace: 'https://streamtpnew.com/global1.php?stream=espn2',       img: 'https://bestleague.world/img/espn2.webp',       hd: _k('RVNQ','TjJf','VVk='), hidden: true },
  { nombre: 'FOX Sports 1', enlace: 'https://streamtpnew.com/global1.php?stream=fox1ar',      img: 'https://bestleague.world/img/foxnew.png',       hd: _k('Rm94','U3Bv','cnRz') },
  { nombre: 'FOX Sports 2', enlace: 'https://streamtpnew.com/global1.php?stream=fox2ar',      img: 'https://bestleague.world/img/foxnew2.png',      hd: _k('Rm94','U3Bv','cnRzMkhE') },
  { nombre: 'FOX Sports 3', enlace: 'https://streamtpnew.com/global1.php?stream=fox3ar',      img: 'https://bestleague.world/img/foxnew3.png',      hd: _k('Rm94','U3Bv','cnRzM0hE') },
  { nombre: 'TyC Sports',   enlace: 'https://streamtpnew.com/global1.php?stream=tycsports',   img: 'https://bestleague.world/img/tyc.webp',         hd: _k('VHlD','U3Bv','cnQ') },
  { nombre: 'TyC Intl',     enlace: 'https://streamtpnew.com/global1.php?stream=tycintl',     img: 'https://bestleague.world/img/tyc.webp',         hd: _k('VHlD','X0lu','dGVybmFjaW9uYWw') },
  { nombre: 'DSports',      enlace: 'https://streamtpnew.com/global1.php?stream=dsports',     img: 'https://bestleague.world/img/dsports.webp',     hd: null },
  { nombre: 'DSports 2',    enlace: 'https://streamtpnew.com/global1.php?stream=dsports2',    img: 'https://bestleague.world/img/dsports2.webp',   hd: null },
  { nombre: 'DSports Plus', enlace: 'https://streamtpnew.com/global1.php?stream=dsportsplus', img: 'https://bestleague.world/img/dsportsplus.webp', hd: null },
  { nombre: 'Win Sports',   enlace: 'https://streamtp10.com/global1.php?stream=winsports',    img: 'https://bestleague.world/img/win.png',          hd: null },
  { nombre: 'Win Sports+',  enlace: 'https://streamtpnew.com/global1.php?stream=winplus',     img: 'https://bestleague.world/img/winsports.webp',   hd: null },
  { nombre: 'TNT Sports',   enlace: 'https://streamtpnew.com/global1.php?stream=tntsports',   img: 'https://bestleague.world/img/tntar.svg',        hd: _k('VE5U','X1Nw','b3J0c19IRA') },
]

export function getEnlace(canal: Canal, mode: number): string {
  const u = canal.enlace
  return mode === 2 ? u.replace('global1.php', 'global2.php') : u
}

export function getEnlaceHD(canal: Canal): string | null {
  return canal.hd ? BASE_JW + canal.hd : null
}
