export const _p = ['htt', 'ps:', '//', 'tvl', 'ibr', '3.c', 'om', '/html/fl/?get=']
export const BASE_JW = _p.slice(0, 3).join('') + _p.slice(3, 7).join('') + _p[7]

export function _k(a: string, b: string, c: string) { return (a || '') + (b || '') + (c || '') }

export interface Canal {
  nombre: string
  enlace: string
  img: string
  hd: string | null
  hidden?: boolean
  options?: { name: string; url: string }[]
}

export const CANALES: Canal[] = [
  { nombre: 'ESPN Premium', enlace: 'https://streamtpnew.com/global1.php?stream=espnpremium', img: 'https://bestleague.world/img/espnpr.webp',     hd: _k('Rm94','X1Nw','b3J0c19QcmVtaXVuX0hE'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/76'}] },
  { nombre: 'ESPN 1',       enlace: 'https://streamtpnew.com/global1.php?stream=espn',        img: 'https://bestleague.world/img/espn.webp',        hd: _k('RVNQ','TjJI','RA'), options: [{name: 'Opción WeLive', url: 'https://welivesports.cfd/embed/espn1arg.php'}] },
  { nombre: 'ESPN 2',       enlace: 'https://streamtpnew.com/global1.php?stream=espn2',       img: 'https://bestleague.world/img/espn2.webp',       hd: _k('RVNQ','TjJf','QXJn'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/88'}, {name: 'Opción WeLive', url: 'https://welivesports.cfd/embed/espn2arg.php'}] },
  { nombre: 'ESPN 3',       enlace: 'https://streamtpnew.com/global1.php?stream=espn3',       img: 'https://bestleague.world/img/espn3.webp',       hd: _k('RVNQ','TjM',''), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/89'}, {name: 'Opción WeLive', url: 'https://welivesports.cfd/embed/espn3arg.php'}] },
  { nombre: 'ESPN 4',       enlace: 'https://streamtpnew.com/global1.php?stream=espn4',       img: 'https://bestleague.world/img/espn4.webp',       hd: _k('RVNQ','Tkh','E'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/90'}] },
  { nombre: 'ESPN 5',       enlace: 'https://streamtpnew.com/global1.php?stream=espn5',       img: 'https://bestleague.world/img/espn5.webp',       hd: _k('RVNQ','TjQ','='), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/91'}] },
  { nombre: 'ESPN 1 CO',    enlace: 'https://streamtpnew.com/global1.php?stream=espn',        img: 'https://bestleague.world/img/espn.webp',        hd: _k('RVNQ','Tl9V','WQ=='), hidden: true },
  { nombre: 'ESPN 2 CO',    enlace: 'https://streamtpnew.com/global1.php?stream=espn2',       img: 'https://bestleague.world/img/espn2.webp',       hd: _k('RVNQ','TjJf','VVk='), hidden: true },
  { nombre: 'FOX Sports 1', enlace: 'https://streamtpnew.com/global1.php?stream=fox1ar',      img: 'https://bestleague.world/img/foxnew.png',       hd: _k('Rm94','U3Bv','cnRz'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/78'}] },
  { nombre: 'FOX Sports 2', enlace: 'https://streamtpnew.com/global1.php?stream=fox2ar',      img: 'https://bestleague.world/img/foxnew2.png',      hd: _k('Rm94','U3Bv','cnRzMkhE'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/79'}] },
  { nombre: 'FOX Sports 3', enlace: 'https://streamtpnew.com/global1.php?stream=fox3ar',      img: 'https://bestleague.world/img/foxnew3.png',      hd: _k('Rm94','U3Bv','cnRzM0hE'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/80'}] },
  { nombre: 'TyC Sports',   enlace: 'https://streamtpnew.com/global1.php?stream=tycsports',   img: 'https://bestleague.world/img/tyc.webp',         hd: _k('VHlD','U3Bv','cnQ'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/77'}, {name: 'Opción WeLive', url: 'https://welivesports.cfd/embed/tycsportarg.php'}] },
  { nombre: 'TyC Intl',     enlace: 'https://streamtpnew.com/global1.php?stream=tycintl',     img: 'https://bestleague.world/img/tyc.webp',         hd: _k('VHlD','X0lu','dGVybmFjaW9uYWw') },
  { nombre: 'DSports',      enlace: 'https://streamtpnew.com/global1.php?stream=dsports',     img: 'https://bestleague.world/img/dsports.webp',     hd: null },
  { nombre: 'DSports 2',    enlace: 'https://streamtpnew.com/global1.php?stream=dsports2',    img: 'https://bestleague.world/img/dsports2.webp',   hd: null },
  { nombre: 'DSports Plus', enlace: 'https://streamtpnew.com/global1.php?stream=dsportsplus', img: 'https://bestleague.world/img/dsportsplus.webp', hd: null },
  { nombre: 'Win Sports',   enlace: 'https://streamtp10.com/global1.php?stream=winsports',    img: 'https://bestleague.world/img/win.png',          hd: null },
  { nombre: 'Win Sports+',  enlace: 'https://streamtpnew.com/global1.php?stream=winplus',     img: 'https://bestleague.world/img/winsports.webp',   hd: null },
  { nombre: 'TNT Sports',   enlace: 'https://streamtpnew.com/global1.php?stream=tntsports',   img: 'https://bestleague.world/img/tntar.svg',        hd: _k('VE5U','X1Nw','b3J0c19IRA'), options: [{name: 'Opción Bola', url: 'https://bolaloca.my/player/3/75'}] },
]

export function getEnlace(canal: Canal, mode: number): string {
  if (mode === 2) return canal.enlace.replace('global1.php', 'global2.php')
  // For modes >= 3, if there's an option available in the array, return it.
  if (mode >= 3 && canal.options && canal.options.length >= (mode - 2)) {
    return canal.options[mode - 3].url
  }
  return canal.enlace
}

export function getEnlaceHD(canal: Canal): string | null {
  return canal.hd ? BASE_JW + canal.hd : null
}
