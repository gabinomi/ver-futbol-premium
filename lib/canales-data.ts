export const _p = ['htt', 'ps:', '//', 'bes', 'tle', 'agu', 'e.t', 'op', '/cvatt.html?get=']
export const BASE_JW = _p.slice(0, 3).join('') + _p.slice(3, 8).join('') + _p[8]

export const _p_tok = ['htt', 'ps:', '//', 'bes', 'tle', 'agu', 'e.t', 'op', '/tok.html?get=']
export const BASE_TOK = _p_tok.slice(0, 3).join('') + _p_tok.slice(3, 8).join('') + _p_tok[8]

export const _p_ext = ['htt', 'ps:', '//', 'can', 'ale', 'sde', 'por', 'tiv', 'os.', 'net', '/']
export const BASE_EXTRA = _p_ext.slice(0, 3).join('') + _p_ext.slice(3, 10).join('') + _p_ext[10]

export function _k(a: string, b: string, c: string) { return (a || '') + (b || '') + (c || '') }

export interface Canal {
  nombre: string
  enlace: string
  img: string
  hd: string | null
  hd2?: string | null
  extra?: string | null
  hidden?: boolean
}

export const CANALES: Canal[] = [
  { nombre: 'ESPN Premium', enlace: 'https://streamtpnew.com/global1.php?stream=espnpremium', img: 'https://bestleague.world/img/espnpr.webp',     hd: _k('Rm94','X1Nw','b3J0c19QcmVtaXVuX0hE'), hd2: _k('Rm94','X1Nw','b3J0c19QcmVtaXVuX0hE'), extra: 'espnpremium.php' },
  { nombre: 'ESPN 1',       enlace: 'https://streamtpnew.com/global1.php?stream=espn',        img: 'https://bestleague.world/img/espn.webp',        hd: _k('RVNQ','TjJI','RA'), hd2: _k('RVNQ','TjJI','RA'), extra: 'espnhd.php' },
  { nombre: 'ESPN 2',       enlace: 'https://streamtpnew.com/global1.php?stream=espn2',       img: 'https://bestleague.world/img/espn2.webp',       hd: _k('RVNQ','TjJf','QXJn'), hd2: _k('RVNQ','TjJf','QXJn'), extra: 'espn2hd.php' },
  { nombre: 'ESPN 3',       enlace: 'https://streamtpnew.com/global1.php?stream=espn3',       img: 'https://bestleague.world/img/espn3.webp',       hd: _k('RVNQ','TjM',''), hd2: _k('RVNQ','TjM',''), extra: 'espn3hd.php' },
  { nombre: 'ESPN 4',       enlace: 'https://streamtpnew.com/global1.php?stream=espn4',       img: 'https://bestleague.world/img/espn4.webp',       hd: _k('RVNQ','Tkh','E'), hd2: _k('RVNQ','Tkh','E'), extra: 'espn4.php' },
  { nombre: 'ESPN 5',       enlace: 'https://streamtpnew.com/global1.php?stream=espn5',       img: 'https://bestleague.world/img/espn5.webp',       hd: _k('RVNQ','TjQ','='), hd2: _k('RVNQ','TjQ','='), extra: 'espn5.php' },
  { nombre: 'ESPN 1 CO',    enlace: 'https://streamtpnew.com/global1.php?stream=espn',        img: 'https://bestleague.world/img/espn.webp',        hd: _k('RVNQ','Tl9V','WQ=='), hidden: true },
  { nombre: 'ESPN 2 CO',    enlace: 'https://streamtpnew.com/global1.php?stream=espn2',       img: 'https://bestleague.world/img/espn2.webp',       hd: _k('RVNQ','TjJf','VVk='), hidden: true },
  { nombre: 'FOX Sports 1', enlace: 'https://streamtpnew.com/global1.php?stream=fox1ar',      img: 'https://bestleague.world/img/foxnew.png',       hd: _k('Rm94','U3Bv','cnRz'), hd2: _k('Rm94','U3Bv','cnRz') },
  { nombre: 'FOX Sports 2', enlace: 'https://streamtpnew.com/global1.php?stream=fox2ar',      img: 'https://bestleague.world/img/foxnew2.png',      hd: _k('Rm94','U3Bv','cnRzMkhE') },
  { nombre: 'FOX Sports 3', enlace: 'https://streamtpnew.com/global1.php?stream=fox3ar',      img: 'https://bestleague.world/img/foxnew3.png',      hd: _k('Rm94','U3Bv','cnRzM0hE') },
  { nombre: 'TyC Sports',   enlace: 'https://streamtpnew.com/global1.php?stream=tycsports',   img: 'https://bestleague.world/img/tyc.webp',         hd: _k('VHlD','U3Bv','cnQ'), hd2: _k('VHlD','U3Bv','cnQ'), extra: 'tycsports-sd.php' },
  { nombre: 'TyC Intl',     enlace: 'https://streamtpnew.com/global1.php?stream=tycintl',     img: 'https://bestleague.world/img/tyc.webp',         hd: _k('VHlD','X0lu','dGVybmFjaW9uYWw') },
  { nombre: 'DSports',      enlace: 'https://streamtpnew.com/global1.php?stream=dsports',     img: 'https://bestleague.world/img/dsports.webp',     hd: null, extra: 'directvsports.php' },
  { nombre: 'DSports 2',    enlace: 'https://streamtpnew.com/global1.php?stream=dsports2',    img: 'https://bestleague.world/img/dsports2.webp',   hd: null, extra: 'dsports2.php' },
  { nombre: 'DSports Plus', enlace: 'https://streamtpnew.com/global1.php?stream=dsportsplus', img: 'https://bestleague.world/img/dsportsplus.webp', hd: null, extra: 'directvplushd.php' },
  { nombre: 'Win Sports',   enlace: 'https://streamtp10.com/global1.php?stream=winsports',    img: 'https://bestleague.world/img/win.png',          hd: null },
  { nombre: 'Win Sports+',  enlace: 'https://streamtpnew.com/global1.php?stream=winplus',     img: 'https://bestleague.world/img/winsports.webp',   hd: null },
  { nombre: 'TNT Sports',   enlace: 'https://streamtpnew.com/global1.php?stream=tntsports',   img: 'https://bestleague.world/img/tntar.svg',        hd: _k('VE5U','X1Nw','b3J0c19IRA'), hd2: _k('VE5U','X1Nw','b3J0c19IRA'), extra: 'tntsports.php' },
]

export function getEnlace(canal: Canal, mode: number): string {
  if (mode === 2) return canal.enlace.replace('global1.php', 'global2.php')
  return canal.enlace
}

export function getEnlaceHD(canal: Canal): string | null {
  return canal.hd ? BASE_JW + canal.hd + '&lang=1' : null
}

export function getEnlaceHD2(canal: Canal): string | null {
  return canal.hd2 ? BASE_TOK + canal.hd2 : null
}

export function getEnlaceExtra(canal: Canal): string | null {
  return canal.extra ? BASE_EXTRA + canal.extra : null
}
