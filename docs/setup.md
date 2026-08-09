# Guía de aprendizaje: portafolio Next.js + Firestore (construido con SDD)

Esta guía está pensada como material de aprendizaje: explica **cómo se construyó
este proyecto**, **qué hace cada archivo**, y **cómo podés repetir el mismo flujo
de trabajo para futuros cambios**. Está escrita para que la completes de punta a
punta sin ayuda externa.

El proyecto es un portafolio de una sola página (Next.js App Router +
TypeScript + Tailwind v4) con contenido estático tipado en `src/data/`, proyectos
dinámicos y mensajes de contacto guardados en Firestore, y una estética
"editorial light" (fondo papel, acento teal, tipografías serif + sans).

---

## 1. Cómo se construyó: el flujo SDD paso a paso

SDD (Spec-Driven Development) organiza el trabajo en fases. Cada fase produce un
artefacto que el siguiente paso consume. El pipeline completo:

| Fase | Qué hace | Artefacto que produce |
|------|----------|----------------------|
| `init` | Arranca el contexto SDD: `openspec/config.yaml`, persistencia, registro | `openspec/config.yaml` |
| `explore` | Idea rápida antes de comprometerse (opcional) | `exploration.md` (si aplica) |
| `propose` | Propone el cambio: intención, alcance, riesgo, rollback | `proposal.md` |
| `spec` | Escribe los requisitos con escenarios (Given/When/Then) | `specs/<dominio>/spec.md` |
| `design` | Decide la arquitectura con tradeoffs explícitos | `design.md` |
| `tasks` | Parte el cambio en fases, tareas y unidades de trabajo | `tasks.md` |
| `apply` | Implementa las tareas en unidades de trabajo y marca `[x]` | `tasks.md` + código |
| `verify` | Prueba que la implementación cumple el spec | `verify-report.md` |
| `archive` | Cierra el cambio y fusiona los specs delta en los specs principales | `archive/<fecha>-<cambio>/` |

Todo esto vive en la carpeta `openspec/changes/portfolio-nextjs-firestore/`.
Para este proyecto se trabajó en **2.800–3.400 líneas** y se partió en **5
unidades de trabajo** (una por PR en una cadena *stacked-to-main*): scaffold →
lib/API → UI → tests → docs. Esta guía es la unidad 5.

### Fases aplicadas a este proyecto

1. **init** — se creó la estructura `openspec/` con el contexto de stack
   (Next.js, TypeScript, sin test runner todavía).
2. **propose** — `proposal.md` definió el alcance: sitio de una página en
   español, proyectos y contactos en Firestore, credenciales solo del lado del
   servidor, guía en español. También los riesgos (set-up manual de
   Firebase/Vercel, abuso del endpoint público) y el plan de rollback.
3. **spec** — cuatro specs delta, uno por capacidad:
   - `specs/profile-presentation/spec.md` — layout, nav, secciones estáticas.
   - `specs/projects-content/spec.md` — proyectos desde Firestore, edición
     visible sin redeploy.
   - `specs/contact-form/spec.md` — formulario con validación, honeypot y rate
     limit.
   - `specs/deployment/spec.md` — despliegue en Vercel y credenciales.
4. **design** — `design.md` decidió la arquitectura con tradeoffs explícitos
   (decisiones D1–D4):
   - **D1** proyectos dinámicos sin caché (un handler GET + `fetch` con
     `no-store`) para que editar Firestore se vea al recargar.
   - **D2** validación con Zod en el servidor + honeypot + rate limit en
     memoria.
   - **D3** una sola variable `FIREBASE_SERVICE_ACCOUNT` (JSON) y nada con
     prefijo `NEXT_PUBLIC_`.
   - **D4** consultas de un solo campo para evitar índices compuestos.
5. **tasks** — `tasks.md` partió el trabajo en 5 fases y pronosticó el budget de
   revisión (riesgo alto → PR encadenados).
6. **apply** — cada unidad de trabajo se implementó con sus tests y un commit
   propio. Encontrar y corregir bugs (por ejemplo, el honeypot que no se
   transmitía al servidor) es parte esperada del flujo, no una excepción.
7. **verify** — queda pendiente: ejecuta `npm run verify` y documentá el
   reporte en `verify-report.md`.

---

## 2. Glosario de conceptos

| Término | Qué significa |
|---------|---------------|
| **openspec** | Estructura de carpetas (`openspec/`) que guarda specs y cambios activos como archivos legibles por humanos. |
| **spec (delta spec)** | Requisitos con escenarios Given/When/Then. "Delta" porque describe el *cambio* sobre los specs principales (`openspec/specs/`). |
| **design** | Decisiones de arquitectura con opciones, tradeoffs y la elegida (tablas de decisión). |
| **tasks** | Desglose del cambio en fases y tareas numeradas, con comandos de verificación y unidades de trabajo. |
| **work unit / unidad de trabajo** | Rodaja del cambio con alcance propio, lista para revisar (~1 PR). |
| **apply** | Fase de implementación: escribe código, tests y marca tareas `[x]`. Esta guía es su producto. |
| **verify** | Fase que ejecuta tests/build y prueba que la implementación cumple el spec. |
| **archive** | Cierra el cambio: mueve la carpeta a `openspec/changes/archive/` y fusiona los deltas en los specs principales. |
| **strict TDD** | Disciplina RED → GREEN → REFACTOR (primero el test que falla). En este proyecto está desactivada (`strict_tdd: false` en config.yaml) porque no había test runner al inicio; se aplicó en su lugar el modo estándar con evidencia por unidad de trabajo. |
| **engram** | Memoria persistente del agente (observaciones con `topic_key` y upsert) en `sdd/<cambio>/...`. |
| **engram vs openspec** | `openspec` es el rastro legible en archivos; `engram` es la memoria del agente. En modo **híbrido** se escriben ambos (este proyecto usa híbrido). |

---

## 3. Glosario de archivos: qué es cada cosa y por qué existe

### Datos y tipos

| Archivo | Qué hace | Por qué |
|---------|----------|---------|
| `src/data/profile.ts`, `socials.ts`, `skills.ts`, `experience.ts`, `education.ts` | Constantes tipadas en español (nombre, redes, skills, experiencia, educación) | Contenido estático editable sin tocar componentes: cambiás el dato y el sitio se actualiza (y el typecheck valida que no rompiste la forma). |
| `src/types/project.ts`, `contact.ts`, `api.ts` | Tipos `Project`, `ContactMessage`, `ApiResponse` | Contrato compartido entre datos, API y UI: un solo lugar define la forma. |

### Lógica pura (sin Firebase, testeable aislada)

| Archivo | Qué hace | Por qué |
|---------|----------|---------|
| `src/lib/validation/contact.ts` | Esquema Zod v4: trim; nombre 1–100; email en minúsculas y bien formado ≤254; mensaje 10–4000 | La validación vive en el **servidor** (un cliente puede mentir). Los mensajes de error son en español y llegan al usuario. |
| `src/lib/honeypot.ts` | Detecta el campo oculto `website` que los humanos no ven | Los bots llenan todos los campos; si está lleno, el servidor responde éxito silencioso **sin guardar nada** (no enseña al bot). |
| `src/lib/rate-limit.ts` | Limitador en memoria inyectable: ventana de 60 s, máximo 3 por key (IP), aislamiento por key | Protege el endpoint público de ráfagas. Se eligió en memoria (se reinicia al reiniciar el server) por simplicidad; el path con Redis queda documentado como mejora futura. |
| `src/lib/projects/parse.ts` | `safeParse` de los documentos de Firestore → `Project[]`; Timestamp → ISO-8601; documentos malformados se omiten | Firestore es *schemaless*: los datos pueden desviarse; la lectura valida y descarta sin romper la página. |

### Firebase y red

| Archivo | Qué hace | Por qué |
|---------|----------|---------|
| `src/lib/firebase/admin.ts` | Singleton de Firebase Admin con inicialización lazy desde `FIREBASE_SERVICE_ACCOUNT`; guard que lanza error si se evalúa en el cliente (`typeof window !== "undefined"`) | Las credenciales **nunca** llegan al navegador. Solo Route Handlers y el script de seed lo importan. |
| `src/lib/api.ts` | Helpers tipados del cliente: `fetchProjects()` (GET con `cache: "no-store"`) y `submitContact()` (POST) | Un solo lugar define cómo el cliente habla con la API; `no-store` garantiza datos frescos. |

### API (Route Handlers)

| Archivo | Qué hace | Por qué |
|---------|----------|---------|
| `src/app/api/projects/route.ts` | `GET` → `orderBy("sortOrder")` → parse → `200 Project[]` | Dinámico y sin caché (D1): editar Firestore aparece al recargar, sin redeploy. |
| `src/app/api/contact/route.ts` | `POST` → honeypot (200 silencioso) → rate limit (429 + Retry-After) → Zod (400) → `contacts.add({status:"new", source:"portfolio"})` → `201 {ok,id}`; 500 en catch | Pipeline de seguridad en orden: no escribís nada inválido ni de bots. |

### UI

| Archivo | Qué hace | Por qué |
|---------|----------|---------|
| `src/app/layout.tsx` | Layout raíz: `lang="es"`, fuentes, metadata | Idioma correcto para accesibilidad y SEO. |
| `src/app/page.tsx` | Compone las secciones en orden | Una sola página; el orden del contenido se ve de un vistazo. |
| `src/app/globals.css` | Tokens de la estética "editorial light": papel `#FAFAF8`, teal `#0F766E`, serif display + sans body, focus ring, `prefers-reduced-motion` | El sistema de diseño en un solo lugar (Tailwind v4). |
| `src/app/sections/` | `Header` (nav sticky + menú móvil accesible), `Hero`, `SobreMi`, `Habilidades`, `Proyectos`, `Experiencia`, `Educacion`, `Contacto`, `Footer` | Cada sección es una Server Component (o Client si necesita estado). |
| `src/components/ui/` | Primitivas: `Container`, `Button`, `SectionHeading` | Componentes atómicos reutilizables. |
| `src/components/ProjectList.tsx`, `ProjectCard.tsx` | Lista cliente de proyectos: estados de carga/vacío/error en español, tarjetas con índice numerado, chips de tecnologías, links | Son estados **client-side** por definición (loading/error), por eso el componente es cliente. |
| `src/components/ContactForm.tsx` | Formulario cliente: estados idle/submitting/success/error; conserva los valores si falla; campo honeypot oculto | UX en español: el visitante reintenta sin reescribir todo. |

### Tests y configuración

| Archivo | Qué hace |
|---------|----------|
| `vitest.config.ts` | Config de Vitest: alias `@`→`src`, entorno node por defecto, suites RTL con pragma `@vitest-environment jsdom`. |
| `src/test/setup.ts` | Limpieza explícita (`afterEach(cleanup)`) para React Testing Library. |
| `src/**/*.test.ts(x)` | Suites unitarias (schema, rate-limit, honeypot, parse, api) y RTL (`ContactForm`, `ProjectList`). |
| `src/lib/firebase/api-routes.integration.test.ts` | Tests de integración contra Firestore real, **saltados automáticamente** (`describe.skipIf`) cuando no hay `FIREBASE_SERVICE_ACCOUNT`. |
| `scripts/seed-projects.mjs` | Seed opcional de 2 proyectos de ejemplo vía Admin SDK. |
| `firestore.rules` | **Deny-all**: `allow read, write: if false` para todo. |

### Seguridad: la regla de oro

`firestore.rules` niega todo acceso directo. El Admin SDK **no pasa por las
reglas** (usa credenciales de servicio), así que el único camino a los datos son
los Route Handlers. Efecto: aunque alguien encontrara el `projectId` de
Firestore, no puede leer ni escribir sin pasar por tu API.

---

## 4. Correr el proyecto en local

Requisitos: Node v24 y npm 11 (los usados durante el desarrollo).

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (http://localhost:3000)
npm run dev

# 3. Chequeo de tipos (TypeScript)
npm run typecheck

# 4. Tests (Vitest; los de integración se saltan sin credenciales)
npm test

# 5. Lint
npm run lint

# 6. Build de producción
npm run build

# 7. Todo junto (tests + lint + build) — el comando que usa verify
npm run verify
```

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción (Turbopack) |
| `npm start` | Sirve el build de producción en local |
| `npm run lint` | ESLint |
| `npm test` | `vitest run --passWithNoTests` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | `npm test && npm run lint && npm run build` |

Sin `FIREBASE_SERVICE_ACCOUNT`, la parte dinámica falla en runtime (los Route
Handlers lanzan error) pero **la página estática se renderiza igual**: probes el
diseño y las secciones, y los tests de integración se saltan solos.

---

## 5. Firebase y Firestore: credenciales y seed

### 5.1 Crear el proyecto y habilitar Firestore

1. Entrá a <https://console.firebase.google.com> y creá un proyecto (o usá uno
   existente).
2. En **Build → Firestore Database**, creá la base de datos. Elegí **modo de
   producción** (las reglas deny-all se suben después).
3. En **Project settings → Service accounts**, presioná **Generate new private
   key**. Se descarga un archivo JSON: es la *service account*.

### 5.2 Configurar `FIREBASE_SERVICE_ACCOUNT` en local

La variable debe contener **el contenido JSON completo de la service account en
una sola línea** (las comillas del JSON incluidas). Nunca se commitea:
`.gitignore` ya excluye `.env*`.

Creá un archivo `.env.local` en la raíz del proyecto (Next.js lo carga solo en
`npm run dev`):

```bash
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "tu-proyecto", ...}'
```

Reglas de oro:

- **Nunca** con prefijo `NEXT_PUBLIC_` (eso lo expondría al navegador).
- Si tenés que mostrarla u operar con ella en PowerShell, exportala solo para
  ese proceso:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT = '{"type": "service_account", ...}'
node scripts/seed-projects.mjs
Remove-Item Env:FIREBASE_SERVICE_ACCOUNT
```

### 5.3 Sembrar proyectos de ejemplo

No hay un script `npm run seed`: el seed se ejecuta directo con Node (el script
lee `process.env`, no `.env.local`):

```bash
# PowerShell
$env:FIREBASE_SERVICE_ACCOUNT = '{"type": "service_account", ...}'
node scripts/seed-projects.mjs

# Linux / macOS / WSL
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", ...}' node scripts/seed-projects.mjs
```

Debe emitir algo como:

```
Seeded project "Cartelera editorial"
Seeded project "Museo de la palabra"
Done. Seeded 2 projects.
```

También podés crear documentos a mano desde la consola de Firebase (el modelo
está en `design.md`, sección *Firestore Schema*). Tip: escribí los Timestamps
como `serverTimestamp` para que la ordenación funcione.

### 5.4 Nota sobre las reglas de Firestore

El archivo `firestore.rules` en la raíz es deny-all y **debe subirse al proyecto
de Firebase** (Firestore → Rules → *Publish*). El Admin SDK ignora las reglas,
así que tu API sigue funcionando; las reglas solo bloquean accesos directos
desde navegadores o clientes sin credenciales.

---

## 6. Despliegue en Vercel (pendiente)

El sitio aún no está desplegado. Cuando lo quieras:

1. Importá el repo en <https://vercel.com/new>.
2. En **Settings → Environment Variables**, agregá `FIREBASE_SERVICE_ACCOUNT`
   con el mismo JSON (Vercel acepta los `\n` escapados del archivo de key).
3. Deployá: `npm run build` corre solo. Las rutas de API quedan como funciones
   serverless dinámicas; la página principal es estática.

---

## 7. Cómo seguir: repetir este flujo para futuros cambios

Este es el "checkout" del flujo: la próxima vez que quieras cambiar algo
(agregar una sección, un blog, cambiar el modelo de datos), hacé lo mismo:

1. **Pensá el cambio** — qué problema resuelve, qué queda dentro y fuera del
   alcance (esto alimenta la propuesta).
2. **`sdd propose`** — escribí intención, alcance, capacidades y riesgos.
3. **`sdd spec`** — requisitos con escenarios Given/When/Then por dominio.
4. **`sdd design`** — decisiones con tradeoffs (tablas de opciones), esquema y
   flujos. Elegí una opción y explicá por qué.
5. **`sdd tasks`** — fases + tareas + pronóstico de budget de revisión; si es
   grande, partilo en unidades de trabajo.
6. **`sdd apply`** — implementá **una unidad a la vez** (con su test y su
   commit), marcá `[x]` en `tasks.md` y persistí el progreso.
7. **`sdd verify`** — ejecutá `npm run verify` (test + lint + build) y probá los
   escenarios del spec.
8. **`sdd archive`** — cerrá el cambio y fusioná los deltas en los specs
   principales.

Reglas que este proyecto demostró y que conviene conservar:

- **Validar en el servidor, nunca confiar en el cliente.**
- **Separar la lógica pura de los bordes** (Firebase/Next): se testea sola y
  sin red.
- **Credenciales solo del lado servidor**, una sola variable, nunca
  `NEXT_PUBLIC_`.
- **Datos schemaless → validar en la lectura** con Zod y descartar lo que no
  cumpla.
- **Artefactos legibles**: cada fase deja un archivo; si alguien pregunta "¿por
  qué está así?", la respuesta está en `design.md`, no en un canal de chat.