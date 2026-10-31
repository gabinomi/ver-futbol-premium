export const FLAGS: Record<string, string> = {
  // Banderas de países
  AR:  'https://flagcdn.com/w40/ar.png',
  ES:  'https://flagcdn.com/w40/es.png',
  BR:  'https://flagcdn.com/w40/br.png',
  EN:  'https://flagcdn.com/w40/gb.png',
  IT:  'https://flagcdn.com/w40/it.png',
  DE:  'https://flagcdn.com/w40/de.png',
  FR:  'https://flagcdn.com/w40/fr.png',
  PT:  'https://flagcdn.com/w40/pt.png',
  COL: 'https://flagcdn.com/w40/co.png',
  CH:  'https://flagcdn.com/w40/cl.png',
  URU: 'https://flagcdn.com/w40/uy.png',
  PE:  'https://flagcdn.com/w40/pe.png',
  MEX: 'https://flagcdn.com/w40/mx.png',
  PY:  'https://flagcdn.com/w40/py.png',
  BOL: 'https://flagcdn.com/w40/bo.png',
  VEN: 'https://flagcdn.com/w40/ve.png',
  ECU: 'https://flagcdn.com/w40/ec.png',
  USA: 'https://flagcdn.com/w40/us.png',
  HOL: 'https://flagcdn.com/w40/nl.png',
  BEL: 'https://flagcdn.com/w40/be.png',
  TUR: 'https://flagcdn.com/w40/tr.png',
  SA:  'https://flagcdn.com/w40/sa.png',

  // Competiciones y deportes con imágenes específicas solicitadas
  CONFERENCE: 'https://i.imgur.com/Z0pZ0df.png',
  CONCACAF:   'https://i.imgur.com/KjnWiPK.png',
  NBA:        'https://i.imgur.com/nV4k8Zm.png',
  LIB:        'https://i.imgur.com/IdXfeQz.png',
  SUD:        'https://i.imgur.com/6s8GUyZ.png',
  CHA:        'https://i.imgur.com/GTMR7ID.png',
  UE:         'https://i.imgur.com/VhEV9aI.png',
  MLB:        'https://i.imgur.com/gAFJsYP.png',
  NFL:        'https://i.imgur.com/rmwX8DS.png',
  MMA:        'https://i.imgur.com/lTJVRFj.png',
  TENIS:      'https://i.imgur.com/6L3iCvP.png',
  F1:         'https://i.imgur.com/HxN3Oa6.png',
  F2:         'https://i.imgur.com/3TrVkd4.png',
  FIFA:       'https://a.espncdn.com/i/leaguelogos/soccer/500/53.png',
  MUNDIAL:    'https://i.imgur.com/YYN77mq.png',

  // Imagen de la pelota por defecto
  FUT:        'https://i.imgur.com/appIhpR.png'
}

export const COUNTRY_DICT: Record<string, string> = {
  'escocia': 'scotland',
  'marruecos': 'morocco',
  'inglaterra': 'england',
  'francia': 'france',
  'alemania': 'germany',
  'italia': 'italy',
  'españa': 'spain',
  'brasil': 'brazil',
  'uruguay': 'uruguay',
  'colombia': 'colombia',
  'chile': 'chile',
  'peru': 'peru',
  'perú': 'peru',
  'ecuador': 'ecuador',
  'paraguay': 'paraguay',
  'venezuela': 'venezuela',
  'bolivia': 'bolivia',
  'mexico': 'mexico',
  'méxico': 'mexico',
  'estados unidos': 'usa',
  'ee. uu.': 'usa',
  'ee uu': 'usa',
  'canada': 'canada',
  'canadá': 'canada',
  'japon': 'japan',
  'japón': 'japan',
  'corea del sur': 'south korea',
  'australia': 'australia',
  'paises bajos': 'netherlands',
  'países bajos': 'netherlands',
  'holanda': 'netherlands',
  'portugal': 'portugal',
  'belgica': 'belgium',
  'bélgica': 'belgium',
  'suecia': 'sweden',
  'suiza': 'switzerland',
  'croacia': 'croatia',
  'dinamarca': 'denmark',
  'polonia': 'poland',
  'gales': 'wales',
  'ucrania': 'ukraine',
  'rusia': 'russia',
  'turquia': 'turkey',
  'turquía': 'turkey',
  'grecia': 'greece',
  'rumania': 'romania',
  'hungria': 'hungary',
  'hungría': 'hungary',
  'austria': 'austria',
  'serbia': 'serbia',
  'republica checa': 'czech republic',
  'república checa': 'czech republic',
  'eslovaquia': 'slovakia',
  'eslovenia': 'slovenia',
  'islandia': 'iceland',
  'irlanda': 'ireland',
  'irlanda del norte': 'northern ireland',
  'arabia saudita': 'saudi arabia',
  'iran': 'iran',
  'irán': 'iran',
  'mali': 'mali',
  'senegal': 'senegal',
  'camerun': 'cameroon',
  'camerún': 'cameroon',
  'nigeria': 'nigeria',
  'ghana': 'ghana',
  'costa de marfil': 'ivory coast',
  'egipto': 'egypt',
  'argelia': 'algeria',
  'tunez': 'tunisia',
  'túnez': 'tunisia',
  'sudafrica': 'south africa',
  'sudáfrica': 'south africa',
  'nueva zelanda': 'new zealand',
  'jamaica': 'jamaica',
  'costa rica': 'costa rica',
  'panama': 'panama',
  'panamá': 'panama',
  'honduras': 'honduras',
  'el salvador': 'el salvador',
  'guatemala': 'guatemala',
  'qatar': 'qatar',
  'china': 'china',
  'india': 'india',
  'indonesia': 'indonesia',
  'malasia': 'malaysia',
  'tailandia': 'thailand',
  'vietnam': 'vietnam',
  'filipinas': 'philippines',
  'siria': 'syria',
  'irak': 'iraq',
  'emiratos arabes unidos': 'uae',
  'oman': 'oman',
  'omán': 'oman',
  'bahrein': 'bahrain',
  'jordania': 'jordan',
  'libano': 'lebanon',
  'líbano': 'lebanon',
  'palestina': 'palestine',
  'koweit': 'kuwait',
  'georgia': 'georgia',
  'armenia': 'armenia',
  'azerbaiyan': 'azerbaijan',
  'kazajistan': 'kazakhstan',
  'uzbekistan': 'uzbekistan',
  'nueva caledonia': 'new caledonia',
  'tahiti': 'tahiti',
  'tahití': 'tahiti',
  'fiyi': 'fiji',
  'islas salomon': 'solomon islands'
}

export function traducirEquipos(titulo: string): string {
  let lower = titulo.toLowerCase()
  for (const [es, en] of Object.entries(COUNTRY_DICT)) {
    // Usamos reemplazo global para cada coincidencia del nombre del país
    lower = lower.split(es).join(en)
  }
  return lower
}

function norm(s: string = ''): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function classificarCategoriaFútbol(cat: string): boolean {
  const c = norm(cat)
  return c.includes('f') && c.includes('tbol')
}

export function esOtrosDeportes(titulo: string, categoria?: string): boolean {
  const t = norm(titulo)
  const c = norm(categoria)
  const otrosKeywords = [
    'nba', 'basquet', 'baloncesto', 'basketball',
    'f1', 'formula 1', 'formula 2', 'f2',
    'ufc', 'mma', 'boxeo', 'boxing', 'bellator', 'pfl',
    'tenis', 'tennis', 'atp', 'wta',
    'nfl', 'american football',
    'mlb', 'baseball', 'beisbol',
    'rugby', 'ciclismo', 'cycling', 'golf', 'hockey', 'padel'
  ]
  return otrosKeywords.some(k => t.includes(k) || c.includes(k))
}

export function esFutbolArgentino(titulo: string, categoria?: string): boolean {
  const t = norm(titulo)
  if (t.includes('saudi') || t.includes('arabia')) return false
  const argKeywords = [
    'liga profesional', 'copa argentina', 'primera nacional', 'nacional b',
    'b metropolitana', 'b metro', 'federal a',
    'torneo proyeccion', 'reserva lpf', 'trofeo de campeones', 'supercopa argentina'
  ]
  if (argKeywords.some(k => t.includes(k))) return true
  if (/\bprimera [bcd]\b/.test(t)) return true
  if (t.includes('copa de la liga') && !t.includes('chile')) return true
  return false
}

export function esFutbolReal(titulo: string, categoria?: string): boolean {
  if (esOtrosDeportes(titulo, categoria)) return false
  return true
}

export function parsearTitulo(titulo: string) {
  const idx = titulo.indexOf(':')
  if (idx !== -1) {
    return {
      liga: titulo.substring(0, idx).trim(),
      partido: titulo.substring(idx + 1).trim()
    }
  }
  return { liga: '', partido: titulo }
}

export function detectarBandera(titulo: string): string {
  const t = norm(titulo)
  const { liga } = parsearTitulo(titulo)
  const l = norm(liga)
  const target = l || t

  // 1. Torneos y deportes con imágenes específicas solicitadas
  if (t.includes('formula 1') || t.includes('f1') || t.includes('gran premio') || t.includes('gp ')) return FLAGS.F1
  if (t.includes('formula 2') || t.includes('f2')) return FLAGS.F2
  if (t.includes('nba') || t.includes('baloncesto') || t.includes('basquet') || t.includes('basketball')) return FLAGS.NBA
  if (t.includes('mlb') || t.includes('baseball') || t.includes('beisbol')) return FLAGS.MLB
  if (t.includes('nfl') || t.includes('american football')) return FLAGS.NFL
  if (t.includes('mma') || t.includes('ufc') || t.includes('bellator') || t.includes('pfl') || t.includes('boxeo') || t.includes('boxing')) return FLAGS.MMA
  if (t.includes('tenis') || t.includes('tennis') || t.includes('atp') || t.includes('wta') || t.includes('roland garros') || t.includes('wimbledon')) return FLAGS.TENIS

  if (t.includes('conference league') || t.includes('uefa conference')) return FLAGS.CONFERENCE
  if (t.includes('champions league') || t.includes('uefa champions')) return FLAGS.CHA
  if (t.includes('europa league') || t.includes('uefa europa')) return FLAGS.UE
  if (t.includes('copa libertadores') || t.includes('libertadores')) return FLAGS.LIB
  if (t.includes('copa sudamericana') || t.includes('sudamericana') || t.includes('recopa sudamericana')) return FLAGS.SUD
  if (t.includes('concacaf') || t.includes('gold cup') || t.includes('copa oro') || t.includes('leagues cup')) return FLAGS.CONCACAF
  if (t.includes('copa del mundo') || t.includes('mundial de la fifa') || t.includes('fifa world cup') || t.includes('eliminatorias')) return FLAGS.MUNDIAL
  if (t.includes('amistoso internacional') || t.includes('amistosos int') || t.includes('fecha fifa') || t.includes('international friendly')) return FLAGS.FIFA

  // 2. Ligas y campeonatos por país (revisando nombre COMPLETO)
  // Arabia Saudita (debe ir antes que Argentina para evitar que "Liga profesional SAUDI" dé Argentina)
  if (target.includes('saudi') || target.includes('arabia') || t.includes('saudi pro league')) return FLAGS.SA

  // Inglaterra (Championship, Premier, FA Cup, etc.)
  if (target.includes('championship') || target.includes('english football league') || target.includes('premier league') || target.includes('fa cup') || target.includes('carabao') || target.includes('efl cup') || target.includes('league one') || target.includes('league two')) return FLAGS.EN

  // Argentina
  if (
    target.includes('liga profesional') ||
    target.includes('copa argentina') ||
    target.includes('primera nacional') ||
    target.includes('nacional b') ||
    target.includes('b metropolitana') ||
    target.includes('b metro') ||
    /\bprimera [bcd]\b/.test(target) ||
    target.includes('federal a') ||
    target.includes('torneo proyeccion') ||
    target.includes('reserva lpf') ||
    target.includes('trofeo de campeones') ||
    target.includes('supercopa argentina') ||
    (target.includes('copa de la liga') && !target.includes('chile'))
  ) {
    return FLAGS.AR
  }

  // España
  if (target.includes('laliga') || target.includes('la liga') || target.includes('hypermotion') || target.includes('copa del rey') || target.includes('supercopa de espana')) return FLAGS.ES

  // Italia
  if ((target.includes('serie a') || target.includes('serie b') || target.includes('coppa italia')) && !target.includes('brasil')) return FLAGS.IT

  // Alemania
  if (target.includes('bundesliga') || target.includes('dfb pokal')) return FLAGS.DE

  // Francia
  if (target.includes('ligue 1') || target.includes('ligue 2') || target.includes('coupe de france')) return FLAGS.FR

  // Brasil
  if (target.includes('brasileirao') || target.includes('copa do brasil') || target.includes('paulista') || target.includes('carioca') || target.includes('gaucho') || target.includes('mineiro')) return FLAGS.BR

  // Portugal
  if (target.includes('liga portugal') || target.includes('primeira liga') || target.includes('taca de portugal') || target.includes('copa de portugal')) return FLAGS.PT

  // Colombia
  if (target.includes('liga betplay') || target.includes('torneo betplay') || target.includes('copa colombia')) return FLAGS.COL

  // Chile
  if (target.includes('campeonato nacional chile') || target.includes('primera division chile') || target.includes('copa chile')) return FLAGS.CH

  // Uruguay
  if (target.includes('campeonato uruguayo') || target.includes('primera division uruguay') || target.includes('copa aufe')) return FLAGS.URU

  // México
  if (target.includes('liga mx') || target.includes('expansion mx') || target.includes('copa mx')) return FLAGS.MEX

  // Perú
  if ((target.includes('liga 1') || target.includes('copa bicentenario')) && !target.includes('laliga')) return FLAGS.PE

  // Estados Unidos
  if (target.includes('mls') || target.includes('major league soccer') || target.includes('usl') || target.includes('us open cup') || target.includes('nwsl')) return FLAGS.USA

  // Países Bajos
  if (target.includes('eredivisie') || target.includes('knvb')) return FLAGS.HOL

  // Bélgica
  if (target.includes('jupiler') || target.includes('pro league belgica')) return FLAGS.BEL

  // Turquía
  if (target.includes('super lig') || target.includes('superlig') || target.includes('turkiye kupasi')) return FLAGS.TUR

  // Paraguay
  if (target.includes('copa de primera') || target.includes('division de honor paraguay')) return FLAGS.PY

  // Ecuador
  if (target.includes('liga pro ecuador') || (target.includes('liga pro') && !target.includes('saudi'))) return FLAGS.ECU

  // Bolivia
  if (target.includes('division profesional bolivia') || target.includes('copa bolivia')) return FLAGS.BOL

  // Venezuela
  if (target.includes('liga futve') || target.includes('primera division venezuela')) return FLAGS.VEN

  // Por defecto si no coincide: pelota de fútbol por defecto
  return FLAGS.FUT
}

export function utcToArg(timeStr: string): string {
  const parts = timeStr.split(':')
  let h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  h = h + 2
  if (h >= 24) h -= 24
  
  const hd = h < 10 ? `0${h}` : `${h}`
  const md = m < 10 ? `0${m}` : `${m}`
  return `${hd}:${md}`
}
