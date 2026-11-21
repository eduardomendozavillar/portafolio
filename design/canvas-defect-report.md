# Defecto: canvas de diseño — el clic sobre elementos no abre el popover de comentario (modo comentar activo)

## Entorno
- Gentle Shell 4.9.0-1.5.2 (gentle-pi 4.9.0), Windows 11, Chrome (usuario) y Chrome headless (reproducción).
- Canvas iniciado con la herramienta `gentle_design` (action "open") sobre un diseño con 5 artboards HTML autónomos (inline CSS, sin scripts propios).

## Comportamiento esperado
Con el modo comentar activo, hacer clic sobre un elemento del artboard abre el popover de comentario para redactar y enviar.

## Comportamiento observado
- El modo comentar SÍ se activa (botón del tool y tecla `C`; `.gd-world` gana `gd-commenting`, sin errores de página).
- El clic sobre el artboard (a través del `.gd-shield`) NO abre el popover (`gd-popover` permanece oculto). Reproducido de forma consistente en 3 servers consecutivos iniciados con `gentle_design` (tras reinicios limpios), con headless Chrome y con el navegador del usuario.
- En contraste: montando el server con `startDesignCanvasServer` (lib/design-canvas-server.ts) desde otro proceso, con el mismo directorio de assets y un artboard cargado, el flujo completo funciona (botón, tecla C, y popover incluido).

## Evidencia adicional
- El servidor inyecta `assets/inspector.js` en cada artboard servido (`inspectorTag`, design-canvas-server.ts:397-404); los picks llegan por postMessage `gd:pick` a canvas-messages.js:44-52, que los descarta silenciosamente si `state.commenting` es falso, el board es system, hay foco en otro board, o `data.generation !== surface.generation` (comentario "belongs to a size the frame no longer has").
- Hipótesis a descartar: el server iniciado por la herramienta sirve los frames con una `generation` que desincroniza con el postMessage del inspector, o el inspector inyectado difiere del usado en el server manual.
- Sin errores de consola ni pageerror durante la reproducción.

## Impacto
El flujo de feedback visual del canvas (comentar elementos) queda inusable en servers iniciados con la herramienta; el modo foco + atajos funcionan, pero no permite crear comentarios.
