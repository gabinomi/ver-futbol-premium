# Sistema de Calendario Deportivo EN VIVO

Extensión del proyecto Ver Fútbol EN VIVO que agrega una agenda deportiva automática con reproductor embebido.

---

## Los 2 blogs nuevos

| Blog | URL | Función |
|---|---|---|
| Calendario | https://tv-libre-ar.blogspot.com | Muestra la agenda del día con todos los partidos |
| Redirector/Reproductor | https://redirect-en-vivo.blogspot.com | Recibe el partido y muestra el reproductor |

---

## Cómo se genera el calendario

### Fuente de datos
Los partidos del día se obtienen desde:
```
https://streamtpnew.com/eventos.json
```
Este archivo JSON es actualizado automáticamente por StreamTP cada día con todos los eventos deportivos disponibles para transmitir. No requiere API key ni autenticación.

### Estructura del JSON
```json
{
  "title": "Liga Profesional: River Plate vs Boca Juniors",
  "time": "21:00",
  "category": "Fútbol",
  "status": "pronto",
  "link": "https://streamtpnew.com/global1.php?stream=tntsports",
  "language": ""
}
```

**Campos importantes:**
- `time` — hora en timezone **UTC-5 (Panama)**. Para mostrar en Argentina se suma **+2hs** (Argentina es UTC-3)
- `category` — puede ser `Fútbol`, `Fútbol_cup` u `Other`
- `status` — `en vivo` o `pronto`
- `link` — URL directa del stream en StreamTP

### Problema CORS
`streamtpnew.com` bloquea requests directos desde el navegador. Para resolverlo se creó un proxy server-side en Vercel:

**API Proxy:**
```
https://ver-futbol-blogger.vercel.app/api/eventos
```
El calendario llama a esta URL en lugar de a StreamTP directamente. Vercel hace la llamada server-side, devuelve el JSON con headers CORS correctos y cachea la respuesta 5 minutos.

**Repositorio GitHub del proxy:**
```
https://github.com/gabinomi/ver-futbol-blogger
```
Archivo relevante: `app/api/eventos/route.ts`

---

## Funcionamiento del calendario

1. Al cargar la página el JS hace `fetch` al proxy de Vercel
2. El proxy consulta `streamtpnew.com/eventos.json` server-side
3. El JSON se devuelve al blog del calendario
4. El JS procesa los datos:
   - Convierte hora de UTC-5 a Argentina (+2hs)
   - Agrupa partidos duplicados (mismo título + hora = mismo partido en distintos canales)
   - Detecta el país de la liga para mostrar la bandera correspondiente
   - Filtra por categoría (Fútbol por defecto)
5. Se renderizan los rows de la agenda ordenados por hora

### Agrupación de streams
Un mismo partido puede aparecer múltiples veces en el JSON con distintos links (distintos canales). El sistema los detecta usando `título + hora` como clave y los agrupa como Opción 1, Opción 2, Opción 3 dentro del mismo row.

### Filtros
- **Solo Fútbol** (por defecto) — muestra `category: "Fútbol"` y `category: "Fútbol_cup"`
- **Todos** — muestra todos los eventos del JSON incluyendo UFC, NBA, F1, etc.

---

## Imágenes de banderas

Las banderas se obtienen desde:
```
https://bestleague.world/jr/NUMERO.png
```
Son las mismas imágenes que usa tv-libre.net. Se detecta el país a partir del nombre de la liga/partido usando palabras clave. Ejemplos:

| País | URL |
|---|---|
| Argentina | //bestleague.world/jr/55.png |
| España | //bestleague.world/jr/34.png |
| Brasil | //bestleague.world/jr/79.png |
| Colombia | //bestleague.world/jr/118.png |
| Chile | //bestleague.world/jr/35.png |
| Uruguay | //bestleague.world/jr/56.png |
| Perú | //bestleague.world/jr/127.png |
| Paraguay | //bestleague.world/jr/47.png |
| México | //bestleague.world/jr/69.png |
| Copa Libertadores | //bestleague.world/jr/76.png |
| Champions League | //bestleague.world/jr/5.png |

---

## El Redirector / Reproductor

Cuando el usuario hace click en una opción del calendario, es enviado a:
```
https://redirect-en-vivo.blogspot.com/?url=LINK&t=TITULO&img=IMAGEN&opt2=LINK2&opt3=LINK3
```

**Parámetros URL:**
| Parámetro | Descripción |
|---|---|
| `url` | Link del stream principal (global1.php) |
| `t` | Título del partido |
| `img` | Imagen de fondo del reproductor |
| `opt2`, `opt3`, `opt4` | Links alternativos si hay múltiples streams |

**Flujo del reproductor:**
1. Muestra imagen de fondo con botón play — no clickeable hasta que termine el contador
2. Contador de 15 segundos con pausa si el usuario cambia de pestaña (Page Visibility API)
3. Al llegar a 0 el botón se activa
4. Click del usuario → aparece el iframe con el stream de StreamTP
5. Controles disponibles: **Manual (Global 1)**, **Auto (Global 2)**, **Recargar**, **Cerrar**
6. Si hay opciones adicionales (opt2, opt3) aparecen como botones extra para cambiar el stream sin recargar

**Global 1 vs Global 2:**
- `global1.php` — reproducción manual (el usuario controla el reproductor)
- `global2.php` — reproducción automática (inicia solo)
- El sistema genera automáticamente la URL de Global 2 a partir de la URL de Global 1

---

## Tecnologías usadas

| Tecnología | Uso |
|---|---|
| Blogger | Hosting de ambos blogs (gratuito) |
| JavaScript vanilla | Fetch, DOM, conversión horaria, agrupación |
| Next.js 14 | Framework del proxy en Vercel |
| Vercel | Hosting del proxy (plan gratuito) |
| StreamTP | Fuente de eventos y streams embebidos |
| bestleague.world | Imágenes de banderas por país |
| Adsterra | Banners de publicidad (728x90, 320x50, 160x600, 300x250) |

---

## Integración con el botón "Ver Canales"

En el blog principal (verfutbol-gratis.blogspot.com) existe un botón **"Ver Canales EN VIVO"** dentro de cada entrada de partido. Este botón está actualmente **oculto via CSS** (`display: none` en `.btn-channels-wrap`).

Cuando se active, apuntará a:
```
https://futbol-envivo-canaleshd.blogspot.com/
```

Ese blog (blog 3) contiene los canales deportivos 24/7 embebidos con iframe de StreamTP. Los canales disponibles son ESPN 1-3, ESPN Premium, Fox Sports 1-3, TyC Sports, TyC Internacional y TNT Sports.

Para activar el botón en el blog principal buscás en el CSS:
```css
/* Para mostrar el botón Ver Canales: cambiar display:none por display:block */
.btn-channels-wrap {
  display: none;
  ...
}
```
Y cambiás `display: none` por `display: block`.

---

## Cómo se complementan los 4 blogs

```
Blog Principal (verfutbol-gratis.blogspot.com)
  → Partidos creados manualmente con panel admin
  → Botón "Ver Canales EN VIVO" → Blog Canales

Blog Calendario (tv-libre-ar.blogspot.com)
  → Partidos automáticos desde StreamTP
  → Click en partido → Blog Redirector/Reproductor

Blog Redirector (redirect-en-vivo.blogspot.com)
  → Recibe partidos del blog principal Y del calendario
  → Muestra contador + reproduce stream via iframe

Blog Canales (futbol-envivo-canaleshd.blogspot.com)
  → Canales 24/7 embebidos directamente
  → Independiente de los partidos
```

---

## Estado actual

| Componente | Estado |
|---|---|
| Proxy Vercel `/api/eventos` | ✅ Activo |
| Blog Calendario | ✅ Activo — muestra partidos del día |
| Blog Redirector/Reproductor | ✅ Activo — reproduce streams via iframe |
| Actualización automática del calendario | ⚠️ Manual (recargar página) |
| Botón "Ver Canales" en blog principal | 🔒 Oculto (pendiente activar) |
| Blog Canales | ⚠️ En desarrollo |
