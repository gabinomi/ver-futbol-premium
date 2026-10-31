export const _p = ['htt', 'ps:', '//', 'bes', 'tle', 'agu', 'e.l', 'ife', '/cvatt.html?get=']
export const BASE_JW = _p.slice(0, 3).join('') + _p.slice(3, 8).join('') + _p[8]

export const _p_tok = ['htt', 'ps:', '//', 'bes', 'tle', 'agu', 'e.l', 'ife', '/tok.html?get=']
export const BASE_TOK = _p_tok.slice(0, 3).join('') + _p_tok.slice(3, 8).join('') + _p_tok[8]

export const _p_ext = ['htt', 'ps:', '//', 'wel', 'ive', 'spo', 'rtz', '.cf', 'd/e', 'mbe', 'd/']
export const BASE_EXTRA = _p_ext.slice(0, 3).join('') + _p_ext.slice(3, 11).join('')

export function _k(a: string, b: string, c: string) { return (a || '') + (b || '') + (c || '') }

export interface Canal {
  nombre: string
  enlace: string
  img: string
  hd: string | null
  hd2?: string | null
  extra?: string | null
  extra2?: string | null
  hidden?: boolean
}

export const CANALES: Canal[] = [
  { nombre: 'ESPN Premium', enlace: 'https://streamtp99a.sbs/global1.php?stream=espnpremium', img: 'https://i.imgur.com/ns052xg.png',     hd: _k('Rm94','X1Nw','b3J0c19QcmVtaXVuX0hE'), hd2: _k('Rm94','X1Nw','b3J0c19QcmVtaXVuX0hE'), extra: 'espnpremarg.php', extra2: 'https://streamxhd.com/live1.php?stream=espnpremium' },
  { nombre: 'ESPN 1',       enlace: 'https://streamtp99a.sbs/global1.php?stream=espn',        img: 'https://tele-libre.icu/img/espn.webp',        hd: _k('RVNQ','TjJI','RA'), hd2: _k('RVNQ','TjJI','RA'), extra: 'espn1arg.php', extra2: 'https://streamxhd.com/live1.php?stream=espn' },
  { nombre: 'ESPN 2',       enlace: 'https://streamtp99a.sbs/global1.php?stream=espn2',       img: 'https://tele-libre.icu/img/espn2.webp',       hd: _k('RVNQ','TjJf','QXJn'), hd2: _k('RVNQ','TjJf','QXJn'), extra: 'espn2arg.php', extra2: 'https://streamxhd.com/live1.php?stream=espn2' },
  { nombre: 'ESPN 3',       enlace: 'https://streamtp99a.sbs/global1.php?stream=espn3',       img: 'https://tele-libre.icu/img/espn3.webp',       hd: _k('RVNQ','TjM',''), hd2: _k('RVNQ','TjM',''), extra: 'espn3col.php', extra2: 'https://streamxhd.com/live1.php?stream=espn3' },
  { nombre: 'ESPN 4',       enlace: 'https://streamtp99a.sbs/global1.php?stream=espn4',       img: 'https://tele-libre.icu/img/espn4.webp',       hd: _k('RVNQ','Tkh','E'), hd2: _k('RVNQ','Tkh','E'), extra: 'espn4col.php', extra2: 'https://streamxhd.com/live1.php?stream=espn4' },
  { nombre: 'ESPN 5',       enlace: 'https://streamtp99a.sbs/global1.php?stream=espn5',       img: 'https://tele-libre.icu/img/espn5.png',        hd: _k('RVNQ','TjQ','='), hd2: _k('RVNQ','TjQ','='), extra: 'espn5col.php', extra2: 'https://streamxhd.com/live1.php?stream=espn5' },
  { nombre: 'ESPN 1 CO',    enlace: 'https://streamtp99a.sbs/global1.php?stream=espn',        img: 'https://tele-libre.icu/img/espn.webp',        hd: _k('RVNQ','Tl9V','WQ=='), hidden: true },
  { nombre: 'ESPN 2 CO',    enlace: 'https://streamtp99a.sbs/global1.php?stream=espn2',       img: 'https://tele-libre.icu/img/espn2.webp',       hd: _k('RVNQ','TjJf','VVk='), hidden: true },
  { nombre: 'FOX Sports 1', enlace: 'https://streamtp99a.sbs/global1.php?stream=fox1ar',      img: 'https://i.imgur.com/z22eGbg.png',       hd: _k('Rm94','U3Bv','cnRz'), hd2: _k('Rm94','U3Bv','cnRz'), extra: 'foxsp1arg.php', extra2: 'https://streamxhd.com/live1.php?stream=fox1ar' },
  { nombre: 'FOX Sports 2', enlace: 'https://streamtp99a.sbs/global1.php?stream=fox2ar',      img: 'https://i.imgur.com/MeXPL3j.png',      hd: _k('Rm94','U3Bv','cnRzMkhE'), extra2: 'https://streamxhd.sbs/live1.php?stream=fox2ar' },
  { nombre: 'FOX Sports 3', enlace: 'https://streamtp99a.sbs/global1.php?stream=fox3ar',      img: 'https://i.imgur.com/px2iS5o.png',      hd: _k('Rm94','U3Bv','cnRzM0hE'), extra2: 'https://streamxhd.com/live1.php?stream=fox3ar' },
  { nombre: 'TyC Sports',   enlace: 'https://streamtp99a.sbs/global1.php?stream=tycsports',   img: 'https://tele-libre.icu/img/tycsports.png',         hd: _k('VHlD','U3Bv','cnQ'), hd2: _k('VHlD','U3Bv','cnQ'), extra: 'tycsportarg.php', extra2: 'https://streamxhd.com/live1.php?stream=tycsports' },
  { nombre: 'TyC Intl',     enlace: 'https://streamtp99a.sbs/global1.php?stream=tycinternacional', img: 'https://tele-libre.icu/img/tycsports.png',         hd: _k('VHlD','X0lu','dGVybmFjaW9uYWw') },
  { nombre: 'DSports',      enlace: 'https://streamtp99a.sbs/global1.php?stream=dsports',     img: 'https://tele-libre.icu/img/dsports.webp',     hd: null, extra: 'directvarg.php', extra2: 'https://streamxhd.com/live1.php?stream=dsports' },
  { nombre: 'DSports 2',    enlace: 'https://streamtp99a.sbs/global1.php?stream=dsports2',    img: 'https://tele-libre.icu/img/dsports2.webp',   hd: null, extra2: 'https://streamxhd.com/live1.php?stream=dsports2' },
  { nombre: 'DSports Plus', enlace: 'https://streamtp99a.sbs/global1.php?stream=dsportsplus', img: 'https://tele-libre.icu/img/dsportsplus.webp', hd: null, extra2: 'https://streamxhd.com/live1.php?stream=dsportsplus' },
  { nombre: 'Win Sports',   enlace: 'https://streamtp99a.sbs/global1.php?stream=winsports',   img: 'https://tele-libre.icu/img/win.png',          hd: null },
  { nombre: 'Win Sports+',  enlace: 'https://streamtp99a.sbs/global1.php?stream=winplus',     img: 'https://tele-libre.icu/img/winsports.webp',   hd: null },
  { nombre: 'TNT Sports',   enlace: 'https://streamtp99a.sbs/global1.php?stream=tntsports',   img: 'https://i.imgur.com/iw2DTPp.png',        hd: _k('VE5U','X1Nw','b3J0c19IRA'), hd2: _k('VE5U','X1Nw','b3J0c19IRA'), extra: 'tntsportarg.php', extra2: 'https://streamxhd.com/live1.php?stream=tntsports' },
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

export function getEnlaceExtra2(canal: Canal): string | null {
  return canal.extra2 || null
}
