# Ver Fútbol EN VIVO — Blogger Templates

Este proyecto contiene las plantillas XML para los 3 blogs de Blogger que conforman la plataforma.

---

## Estructura

```
verfutbol-blogger/
├── principal/
│   └── plantilla_v13.xml
├── redirector/
│   └── plantilla_redirector.xml
└── canales/
    └── plantilla_canales.xml
```

---

## Blog Principal

Es el sitio principal donde el usuario llega. Muestra los partidos disponibles en un grid, el usuario elige un partido, ve los detalles, horarios por país, marcador y los botones para ver la transmisión.

## Blog Redirector

Funciona como intermediario invisible. Cuando el usuario hace click en cualquier botón de transmisión del blog principal, no va directo al stream — pasa primero por este blog. Muestra un contador de 15 segundos antes de redirigir al destino final. Su propósito es ocultar los links de streaming y generar una página adicional con espacio para anuncios.

## Blog Canales

Complemento del principal. En lugar de links a partidos específicos, ofrece canales deportivos en vivo embebidos directamente en la página (ESPN, TyC, Fox Sports, etc.). El usuario puede ver el canal completo sin importar qué partido esté transmitiendo en ese momento.

---

## Cómo se complementan

El blog principal captura al usuario que busca un partido específico. El redirector intercepta ese click y monetiza el tráfico con anuncios durante la espera. El blog de canales retiene al usuario que no encuentra su partido o que simplemente quiere ver qué está transmitiendo ahora mismo.

Los tres juntos cubren el flujo completo:

```
Descubrir → Ver → Quedarse
```

| Blog | URL | Función |
|---|---|---|
| Principal | verfutbol-gratis.blogspot.com | Grid de partidos y página de cada partido |
| Redirector | redir-futbol.blogspot.com | Contador + redirección a los streams |
| Canales | futbol-envivo-canaleshd.blogspot.com | Canales deportivos en vivo embebidos |
