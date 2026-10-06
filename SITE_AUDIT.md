# Portfolio site audit

Read-only audit of the current site at the time of writing. No application code was changed to produce this report.

The site is a dark, single-page 3D developer portfolio (a customized “3dfolio” template). Projects shown on the homepage come from Firebase. There are no project detail pages, no edit/delete UI, and no career timeline in the code.

---

## 1. Project overview

**What it is.** A personal portfolio for the brand **Riocodex / Rio**. The browser title calls him a Web3 developer. The navbar calls him a software engineer. The hero and About section describe UI, websites, and blockchain. The legal name Rosario Onwuka does not appear in the UI. The only personal identifier in source is the contact fallback email `onwukachibike@gmail.com`.

**Framework.** Vite + React 18 single-page app. Package name in `package.json` is `3dfolio`, version `0.0.0`, `"type": "module"`. Entry is `index.html` → `src/main.jsx` → `src/App.jsx`.

**Main libraries** (`package.json`):

| Package | Version | Used for |
|---|---|---|
| react / react-dom | ^18.2.0 | UI |
| react-router-dom | ^6.8.1 | Three URL routes |
| vite / @vitejs/plugin-react | ^4.1.0 / ^3.1.0 | Dev and build |
| tailwindcss / postcss / autoprefixer | ^3.2.6 / ^8.4.21 / ^10.4.13 | Styling |
| framer-motion | ^9.0.7 | Section and card motion |
| three | ^0.149.0 | 3D |
| @react-three/fiber | ^8.11.1 | React renderer for Three |
| @react-three/drei | ^9.56.24 | GLTF, controls, loader, decals, stars |
| maath | ^0.5.2 | Random star positions |
| react-parallax-tilt | ^1.7.272 | Card tilt |
| firebase | ^12.14.0 | Auth, Firestore, Storage |
| @emailjs/browser | ^3.10.0 | Contact form |
| react-vertical-timeline-component | ^3.6.0 | **Installed, never imported** |

There is no TypeScript in the app. `@types/react` is only a devDependency. There are no tests.

**Build.** `vite.config.js` is the React plugin only. Scripts: `dev`, `build`, `preview`.

**Styling.** Tailwind JIT (`tailwind.config.cjs`, content `./src/**/*.{js,jsx}`). Shared class strings in `src/styles.js`. Global CSS in `src/index.css` (Poppins, gradients, hash offset, canvas loader).

**Hosting assumption.** `vercel.json` rewrites every path to `/index.html`. `src/firebase/config.js` throws on missing env and tells the operator to set variables in Vercel and redeploy. There is no `firebase.json`. `firestore.rules` and `storage.rules` are reference files; they are not deployed by this repo’s build.

**Firebase services in use.** Firebase App, Authentication (email/password), Cloud Firestore (collection `projects`), Cloud Storage (path prefix `projects/`). No Analytics, Functions, or Admin SDK.

**Architecture in one paragraph.** `App` wraps everything in `BrowserRouter` and `AuthProvider`. Route `/` renders one long page: Navbar, Hero, About, Tech, Works, Feedbacks, Contact, plus a starfield behind Contact. Works loads every Firestore project on mount. An admin signs in at `/admin/login`, then creates a project at `/add-project`. That page uploads an image to Storage and writes one Firestore document. There is no in-app project page. A card click opens an external URL.

**Important config files.**

- `index.html` — title, favicon, viewport
- `vite.config.js`, `tailwind.config.cjs`, `postcss.config.cjs`
- `vercel.json`
- `.env.example` — variable names only
- `src/firebase/config.js`
- `firestore.rules`, `storage.rules`
- `src/constants/index.js` — almost all non-project copy

**How the folders fit.**

- `public/` — files served as-is: `me.jpeg` (avatar and favicon), `logo.svg` (unused by the UI), `desktop_pc/` (hero GLTF), `planet/` (contact earth GLTF).
- `src/main.jsx` — mounts React.
- `src/App.jsx` — routes and homepage composition.
- `src/components/` — homepage sections. `canvas/` is the four WebGL scenes. `ProtectedRoute.jsx` gates `/add-project`.
- `src/pages/` — `AdminLogin.jsx`, `AddProject.jsx` only.
- `src/context/AuthContext.jsx` — Firebase auth session.
- `src/firebase/config.js` — initializes Firebase. Importing it crashes the app if any Firebase env var is missing.
- `src/hooks/useProjects.js` — React state around fetch/add.
- `src/utils/projectsStorage.js` — the only Firestore/Storage data layer.
- `src/utils/motion.js` — Framer Motion variants.
- `src/hoc/SectionWrapper.jsx` — padding, max width, scroll-in, hash anchor.
- `src/constants/index.js` — nav, services, technologies, testimonials, and a **legacy project array that the live grid does not use**.
- `src/assets/` — bundled icons, tech logos, hero background, screenshots, unused template images.
- `src/styles.js`, `src/index.css` — visual system.

---

## 2. Routes and pages

There are exactly three React Router paths. Homepage sections are hash anchors on `/`, not routes.

| Path | Component | Access | What it is |
|---|---|---|---|
| `/` | `Portfolio` inside `src/App.jsx` | Public | Entire portfolio |
| `/admin/login` | `src/pages/AdminLogin.jsx` | Public URL, not linked in nav | Email/password sign-in |
| `/add-project` | `src/pages/AddProject.jsx` inside `ProtectedRoute` | Signed-in Firebase user only | Create one project |

**Does not exist:** project detail routes, edit routes, delete UI, admin dashboard, signup, password reset, blog, CV page, 404 page, footer route.

Unknown URLs such as `/foo` match no `<Route>`. React Router renders nothing inside the dark `bg-primary` shell. Vercel still serves `index.html`, so the user sees a blank dark page, not a server 404.

### `/` — homepage

Defined in `src/App.jsx` as `Portfolio`, in this order:

1. A `bg-hero-pattern` wrapper containing `Navbar` and `Hero`.
2. `About` — anchor `#about`.
3. `Tech` — no nav anchor (`SectionWrapper(Tech, "")`).
4. `Works` — anchor `#projects`. Data from Firestore.
5. `Feedbacks` — no nav anchor.
6. A `relative z-0` wrapper containing `Contact` (`#contact`) and `StarsCanvas` behind it.

No Firebase on Hero, About, Tech, Feedbacks, or Contact. Firebase is used by Works (read) and, if a session exists, by the Add/Logout buttons.

Interactions: hash scroll, 3D orbit on the hero computer (zoom off, vertical tilt locked), tilt wrappers on service and project cards, project cards open external links, contact form submits to EmailJS.

Navbar is fixed. Sections other than Hero are `max-w-7xl` with responsive padding.

### `/admin/login`

Form: email, password. Submit calls `signInWithEmailAndPassword`, then `navigate("/add-project")`. Failure sets the visible string `Invalid email or password.` Link `← Back to portfolio` goes to `/`.

Not linked from the public nav. Anyone who knows the URL can open it. It still renders `Navbar`. Hash links in that navbar (`#about`, `#projects`, `#contact`) point at the admin URL, where those sections do not exist.

### `/add-project`

`ProtectedRoute` (`src/components/ProtectedRoute.jsx`): while auth is resolving, it shows `Loading...`. If `user` is null, it redirects to `/admin/login`. Otherwise it renders `AddProject`.

Fields: Project Name, Description, GitHub Link (required), Website Link (optional), Project Image (required, max 2MB, `accept="image/*"`). Client validation is `alert()`. Success navigates to `/` and sets `window.location.hash = "projects"`.

### Hash behavior

`SectionWrapper` inserts `<span className="hash-span" id={idName}>`. CSS pulls that span up by 100px so the fixed nav does not cover the heading. Navbar and the hero scroll cue use `<a href="#...">`. Active nav state is click-only. There is no scroll spy.

`Tech` and `Feedbacks` pass an empty id, so they are not link targets.

---

## 3. Firebase architecture

**Initialization** is `src/firebase/config.js`. It builds config from Vite env vars, throws if any are missing, warns if `authDomain` does not start with `projectId`, then exports `auth`, `db`, and `storage`.

**Env var names only** (from `.env.example` and `config.js`):

Firebase, required at startup:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

EmailJS, required only when the contact form is submitted:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Because `AuthProvider` imports `firebase/config.js`, a missing Firebase variable prevents the whole site from rendering, including the homepage.

**Auth.** Email/password sign-in only. `AuthContext` subscribes with `onAuthStateChanged` and exposes `{ user, loading, logout }`. `logout` is `signOut(auth)`. No signup screen, no roles, no custom claims, no email allowlist in frontend or rules.

**Firestore.** One collection: `projects`. Document IDs are Firestore auto-IDs. Reads are `getDocs` of the whole collection. The only write in application code is `addDoc`. There is no `updateDoc`, `deleteDoc`, `where`, or `orderBy`.

**Rules in the repo** (`firestore.rules`):

- `read` on `projects/{projectId}` if true (public).
- `create`, `update`, `delete` if `request.auth != null` (any signed-in user).

**Storage rules** (`storage.rules`):

- `read` on `projects/{allPaths=**}` if true.
- `write` if `request.auth != null`.

**Document fields actually written** by `addProject` in `src/utils/projectsStorage.js`:

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required by the form |
| `description` | string | Required by the form |
| `source_code_link` | string | Required. Labeled “GitHub Link” |
| `website_link` | string | Optional. Stored as `""` if omitted |
| `image` | string | Firebase download URL. Empty string only if no file; the form requires a file |
| `tags` | array | Always `[]` from the add form |
| `createdAt` | Firestore server timestamp | Set on write. Not included in the object returned to local state |

On read, `mapDoc` adds `id` from the snapshot and defaults missing `tags` to `[]`. Any extra fields that happen to exist in Firestore would pass through via the spread, but the app never writes them.

**Not in the schema:** slug, status, draft, published, featured, order, category, role, problem, technologies as a separate field, updatedAt, metrics, testimonials, screenshots array.

**Sort.** Client-side, newest `createdAt` first. A Firestore `Timestamp` uses `toMillis()`. A plain `{ seconds }` object uses `seconds * 1000`. Missing dates sort as `0`.

**Filter.** None. Every document is shown.

**Tags display.** `ProjectCard` accepts `{ name, color }` or a plain string. `color` is a CSS class name such as `blue-text-gradient`. The admin form never collects tags, so live cards usually have no tags unless documents were edited outside this app.

**Links.** `normalizeUrl` in `Works.jsx` prepends `https://` if the scheme is missing. Card click opens `website_link` if non-empty, otherwise `source_code_link`, in a new tab. The GitHub icon opens `source_code_link` only and stops the card click.

**Images.** `<img src={image}>`. Upload path: `projects/{Date.now()}-{originalFileName}`. Example shape: `projects/1728142800000-screenshot.png`. Filename is not sanitized. No project id in the path.

**Example document (placeholders only):**

```json
{
  "id": "autoGeneratedFirestoreId",
  "name": "Example Product",
  "description": "One paragraph stored exactly as typed in the admin form.",
  "source_code_link": "https://github.com/example/repo",
  "website_link": "https://example.com",
  "image": "https://firebasestorage.googleapis.com/v0/b/BUCKET/o/projects%2F1700000000000-shot.png?alt=media",
  "tags": [],
  "createdAt": "Firestore Timestamp"
}
```

A tag-bearing document, only if written outside the current form, would look like:

```json
{
  "tags": [
    { "name": "react", "color": "blue-text-gradient" },
    "mongodb"
  ]
}
```

---

## 4. Project publishing workflow

This is create-only.

1. Operator opens `/admin/login` by URL. It is not in the navbar.
2. `AdminLogin.handleSubmit` calls `signInWithEmailAndPassword(auth, email, password)`.
3. On success, the app navigates to `/add-project`.
4. `ProtectedRoute` allows the page only when `user` is set.
5. `AddProject.handleSubmit` requires name, description, GitHub link, and an image under 2MB. Website is optional. Validation failures use `alert()`.
6. It calls `useProjects().addProject`, which calls `projectsStorage.addProject`.
7. If a file exists, Storage `uploadBytes` then `getDownloadURL`.
8. Firestore `addDoc` on collection `projects` with the fields above and `createdAt: serverTimestamp()`. Tags are hardcoded to `[]`.
9. The hook prepends the returned object onto local state. That object has no `createdAt`.
10. The page navigates to `/#projects`.
11. On the next mount, `Works` → `useProjects` → `fetchProjects` → `getDocs` → client sort → `ProjectCard` grid.

**Visibility.** Immediate. There is no draft or publish flag. A successful write is public because rules allow public read and the UI renders every document.

**Edit.** Not implemented.

**Delete.** Not implemented in the UI. Rules still allow any authenticated user to delete.

**Featured, manual order, categories, slugs, detail pages.** Not implemented. Order is newest `createdAt` first.

**What makes it reusable.** One collection, one fetch function, one add function, one hook, one card. Adding a project does not require a code change or a new route. The form cannot express status, multiple images, private vs public, or a case-study structure. GitHub is mandatory, which does not fit a private product with no public repo.

**Error copy on failed upload** (`AddProject.jsx`): `storage/unauthorized` mentions Storage rules; `permission-denied` mentions Firestore rules. Other errors show `err.message`.

`AddProject` calls `useProjects()`, so opening the form also runs a full `fetchProjects()` even though the page does not display the list.

---

## 5. Project UI

Component: `ProjectCard` inside `src/components/Works.jsx`.

Layout: responsive grid, `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`, gap 28px (`gap-7`), 80px below the intro (`mt-20`).

Each card:

- Framer Motion `fadeIn` upward, delay `index * 0.5` seconds.
- `react-parallax-tilt` `Tilt` with an `options` object (`max: 45`, `scale: 1`, `speed: 450`). That `options` prop is the old `react-tilt` API. `react-parallax-tilt` v1.7 expects props such as `tiltMaxAngleX`. The configured tilt may not actually run.
- Surface: `bg-tertiary` (`#151030`), padding 20px, `rounded-2xl`.
- Image: full card width, fixed height 230px, `object-cover`, `rounded-2xl`, alt text always `project_image`.
- If `source_code_link` exists, a 40px circular black-gradient button sits at the top right of the image with `github.png`. Class `card-img_hover` is applied, but **that class is not defined anywhere**, so the GitHub button is always visible, not hover-only.
- Title: white, bold, 24px. Description: `#aaa6c3`, 14px / 22px line height. No clamp, so long descriptions grow the card.
- Tags render only if the array is non-empty, as `#name` with an optional gradient text class. Live admin creates no tags.
- No status badge, no category, no “view case study” control.

Click: if a link exists, the whole card is `role="link"`, `tabIndex={0}`, cursor pointer, and opens the URL in a new tab. Enter and Space work on the card. The GitHub control is `role="button"` but its key handler only calls `stopPropagation`. It does not open the link on Enter.

States:

- Loading: `Loading projects...`
- Error: `Failed to load projects. Check your Firebase configuration.` in `text-red-400`
- Empty: `No projects yet.`
- Signed in: purple `+ Add Project` and tertiary `Log out` next to the heading

Section chrome, hardcoded in `Works.jsx`:

- Eyebrow: `My work`
- Heading: `Projects.`
- Body: “Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos in it. It reflects my ability to solve complex problems, work with different technologies, and manage projects effectively.”

---

## 6. Homepage, section by section

Order is fixed in `Portfolio` inside `src/App.jsx`. There is no footer.

### Navigation — `src/components/Navbar.jsx`

Fixed top, `z-20`, padding from `styles.paddingX`. Transparent until `scrollY > 100`, then solid `#050816`.

Left: circular image `./me.jpeg` (36×36, alt `logo`) plus **Riocodex** and, from the `sm` breakpoint up, **| Software Engineer**. The logo `Link` goes to `/` and scrolls to top.

Desktop links, hidden below 640px: **About**, **Projects**, **Contact**.

No CV, no social links, no admin link, no link to Tech or Testimonials.

### Hero — `src/components/Hero.jsx`

Full viewport. Not wrapped by `SectionWrapper`, so it has no hash id.

Left column, starting 120px from the top: a 20px purple dot (`#915EFF`) and a vertical violet gradient line (160px tall, 320px from `sm` up).

Visible text:

- `Hi, I'm Rio` — `Rio` is `#915EFF`. Heading uses `styles.heroHeadText`: black weight, 40px → 50px at 450px → 60px at 640px → 80px at 1024px.
- `I design user interfaces, websites and blockchain applications` — color `#dfd9ff`, 16px → 20px → 26px → 30px. The line break before “and” exists only from `sm` up.

Behind the text, `ComputersCanvas` fills the section: a GLTF desktop PC from `public/desktop_pc/scene.gltf`. Orbit is horizontal only. Zoom is off. Below 500px the model scale is 0.7 and position shifts. While the model loads, `CanvasLoader` shows a spinning shadow animation and a percentage.

Bottom center: a fake mouse outline. A dot bounces forever. The control is `<a href="#about">`. Its bottom offset is `bottom-32` on small screens and `xs:bottom-10` (40px) from 450px up, so the control sits higher on the smallest phones.

Hero background image is `src/assets/herobg.png` via Tailwind `bg-hero-pattern`, applied on the wrapper in `App.jsx`, not on the Hero component itself.

Data source: none. No CTA button. The only action is scroll-to-about.

### About — `src/components/About.jsx`, anchor `#about`

Eyebrow `Introduction`. Heading `Overview.` (`styles.sectionHeadText`: white, black weight, 30px → 40px → 50px → 60px).

Body, exact:

> I am a skilled Web Designer and Blockchain Developer with expertise in creating responsive websites and decentralized applications (dApps). Proficient in modern tools like React, Next.js, and Material-UI, I deliver seamless user experiences. My blockchain experience includes developing smart contracts, NFT marketplaces, and DeFi platforms, ensuring security and scalability. I’m passionate about merging creativity with technology to craft innovative solutions.

Then four service cards from `constants.services`, flex-wrap, gap 40px, each `xs:w-[250px] w-full`, min height 280px, dark fill, 1px green-to-pink gradient frame, `shadow-card`. Titles:

- Ui/UX designer (`mobile.png`)
- Web Developer (`web.png`)
- Backend Developer (`backend.png`)
- Web3 Developer (`creator.png`)

All four images use alt `web-development`. `Tilt` wraps the card, but the `options` object is on an inner `div`, so it does nothing.

Entrance: heading `textVariant` (spring down from -50px), paragraph and cards `fadeIn`. The section’s `whileInView` runs once when 25% is visible.

### Tech — `src/components/Tech.jsx`

No heading. No hash. A centered wrap of 112×112 canvases, one per technology. Each is a floating cream icosahedron (`#fff8eb`) with the logo as a decal. Icons can be dragged (orbit, no zoom). Data is the hardcoded `technologies` array. Thirteen separate WebGL contexts.

### Projects — `Works`, anchor `#projects`

Described in section 5. Data is Firestore, not `constants.projects`.

### Testimonials — `src/components/Feedbacks.jsx`

No hash, so it is not in the nav.

Outer band `bg-black-100`, inner header `bg-tertiary`, min height 300px. Eyebrow `What others say`. Heading `Testimonials.`

Cards overlap the header by being pulled up 80px (`-mt-20`). Each card is `bg-black-200`, `rounded-3xl`, about 320px wide from 450px up, full width below that. A giant white quotation mark (48px, font-black) sits above the quote.

Three hardcoded testimonials. See section 10 for the exact quotes. Two avatars are `randomuser.me` URLs. One is `src/assets/Nick.png`.

### Contact — `src/components/Contact.jsx`, anchor `#contact`

Below the `xl` breakpoint the column is reversed, so the earth appears above the form. From `xl` up, form is on the left (flex 0.75) and earth on the right.

Eyebrow `Get in touch`. Heading level is `h3`, unlike other sections which use `h2`: `Contact.`

Form fields, all `required`:

| Label | Input name | Placeholder |
|---|---|---|
| Your Name | `from_name` | What's your good name? |
| Your email | `reply_to` | What's your email address? |
| Your Message | `message` | What you want to say? |

Button label is `Send`, or `Sending...` while in flight. The button is `bg-tertiary`, not the purple used on admin buttons. Inputs use `outline-none` with no replacement focus ring.

`EarthCanvas` loads `public/planet/scene.gltf`, auto-rotates, zoom off. Height 350px, or 550px from `md` up.

Behind this block, `StarsCanvas` is `absolute inset-0 z-[-1]`: about 5,000 pink points (`#f272c8`) slowly rotating. `maath` supplies positions. The star canvas has no loader fallback (`fallback={null}`).

Slide-in animation from left (form) and right (earth).

---

## 7. Current visual design

A designer who cannot open the site should picture this:

Near-black navy page (`#050816`). Lavender-gray body text (`#aaa6c3`). White headlines in a very heavy weight. One purple accent (`#915EFF`) on the name “Rio”, the hero dot, and admin buttons. Cards are a slightly lighter navy (`#151030` and `#100d25` / `#090325`). The hero sits on a photographic/abstract dark texture (`herobg.png`). A 3D computer occupies the first screen. Later, floating logo balls, then project cards, then overlapping testimonial cards, then a contact form beside a rotating earth, with pink star dust behind the contact area.

### Colors

| Token | Hex | Role |
|---|---|---|
| primary | `#050816` | Page background, nav after scroll |
| secondary | `#aaa6c3` | Body, inactive nav, placeholders |
| tertiary | `#151030` | Cards, inputs, Send button |
| black-100 | `#100d25` | Contact and admin form panels |
| black-200 | `#090325` | Testimonial cards |
| white-100 | `#f3f3f3` | Token exists; hero subtext actually uses `#dfd9ff` |
| accent | `#915EFF` | Name, dot, primary admin buttons |
| stars | `#f272c8` | Particle field |
| ball | `#fff8eb` | Tech spheres |

Gradients in `src/index.css`:

- `.violet-gradient` — `#804dee` fading out (hero line)
- `.green-pink-gradient` — `#00cea8` to `#bf61ff` (service card frame). The first `background` declaration is the invalid string `"#00cea8"` including quote characters.
- `.black-gradient` — `#434343` to `#000000` (mobile menu, GitHub button)
- Text gradients: orange `#f12711`→`#f5af19`, green `#11998e`→`#38ef7d`, blue `#2f80ed`→`#56ccf2`, pink `#ec008c`→`#fc6767`. Used for tags and the `@` before testimonial names. Orange is defined and unused by current content.

`color-scheme: dark` is set on every element.

No glassmorphism. No blur. Glow is limited to the canvas loader’s animated white box-shadows and the general neon/purple 3D look.

Shadow: `shadow-card` is `0px 35px 120px -15px #211e35` on service cards. Admin submit buttons use `shadow-md shadow-primary`.

Corners are large: `rounded-2xl`, `rounded-3xl`, `rounded-[20px]`.

### Typography

Font is **Poppins**, weights 100–900, loaded from Google Fonts in `src/index.css`, forced onto `*`.

Hierarchy is a small uppercase tracked eyebrow (`sectionSubText`, secondary color, 14/18px) plus a huge black-weight heading ending in a period: `Overview.`, `Projects.`, `Testimonials.`, `Contact.`, `Login.`, `Add Project.`

Body copy is mostly 17px / 30px, secondary color, max width `max-w-3xl`.

`font-poppins` is used on the mobile menu but is **not** a Tailwind font family. Poppins still applies because of the global `*` rule.

### Layout

Content width `max-w-7xl` (80rem) centered. Section padding: horizontal 24px, or 64px from `sm`; vertical 40px, or 64px from `sm` (`styles.padding`). Hero text uses the same horizontal padding.

### Animation

Libraries: Framer Motion, react-parallax-tilt, Three.js via React Three Fiber.

`src/utils/motion.js`:

- `textVariant` — spring from y -50
- `fadeIn(direction, type, delay, duration)`
- `slideIn` — used by Contact and both admin pages
- `staggerContainer` — `SectionWrapper` parent; child variants are supposed to stagger, but several children also set their own `initial`/`animate`, which can break the stagger
- `zoomIn` — **exported, never used**

`SectionWrapper`: `whileInView="show"`, `viewport={{ once: true, amount: 0.25 }}`.

No page transitions. No `prefers-reduced-motion`. Hero mouse dot loops forever. Earth auto-rotates. Stars rotate in `useFrame`. Tech balls use drei `Float`.

Loaders: canvas percentage plus `.canvas-loader`; text states `Loading...`, `Loading projects...`, `Sending...`, `Uploading...`, `Signing in...`.

### Icons

No icon library. Local SVG/PNG only: `menu.svg`, `close.svg`, `github.png`, four service PNGs, thirteen tech logos. `src/assets/logo.svg` is imported in the navbar and unused. `public/logo.svg` is unused by components.

### Imagery

- Avatar: `public/me.jpeg` (about 113KB). Navbar uses the relative URL `./me.jpeg`, which resolves correctly on `/` and incorrectly on `/admin/login` and `/add-project` (browser requests `/admin/me.jpeg`).
- Favicon: same file, but `index.html` declares `type="image/svg+xml"` for a JPEG.
- Hero texture: `src/assets/herobg.png` (about 930KB).
- Decorative 3D: `public/desktop_pc/`, `public/planet/`.
- Live project images: Firebase URLs, not repo files.
- Legacy screenshots in `src/assets/`, imported by constants and therefore bundled even though the live grid does not render them: `metaversus.png` (~2.8MB), `wemakeclothes.png` (~1.2MB), `rethestate.png` (~1.5MB), `fashionswipe.png` (~1.7MB).
- Template leftovers, likely tree-shaken if nothing imports them: `carrent.png`, `jobit.png`, `tripguide.png` (~3.4MB), company logos for Meta, Shopify, Starbucks, Tesla, plus custom `rethestate`, `upwork`, `aptech`. `docker.png` is exported and unused.
- Testimonial photos: `Nick.png` (~385KB) and two external randomuser portraits.

---

## 8. Navigation

**Desktop.** Fixed bar. Brand links home. Three hash links. Active item turns white only after click, and that state is not cleared when the user scrolls to another section. Hover turns links white.

**Mobile (under 640px).** Hash links hide. An `img` hamburger (`menu.svg` / `close.svg`) toggles a small `black-gradient` dropdown, `min-w-[140px]`, absolutely positioned at the right. Same three links. Choosing one closes the menu. The control is not a `<button>`, has no `aria-expanded`, and is not keyboard-operable.

**Scrolling.** `scroll-behavior: smooth` is on every element via `*` in `index.css`. Hash offset is 100px.

**External links.** Only from project cards (new tab, `noopener,noreferrer`). No social row.

**CV.** None.

**Contact behavior.** Nav goes to `#contact`. It does not open a mail client.

**Admin pages reuse this navbar.** Hash links do not jump to homepage sections. The brand link does return to `/`.

---

## 9. Responsive behavior

Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) plus custom `xs` at 450px. The hero 3D scene uses a separate 500px media query, which matches neither `xs` nor `sm`.

| Area | Change |
|---|---|
| Nav | Links hidden under 640px; hamburger shown. Subtitle `\| Software Engineer` hidden under 640px |
| Hero type | 40 / 50 / 60 / 80px |
| Hero subcopy line break | Only from 640px |
| Hero line | 160px vs 320px |
| Scroll cue | `bottom-32` below 450px, `bottom-10` from 450px — easiest to collide with the 3D model or the bottom of the viewport on small phones |
| 3D computer | Scale and position change at 500px |
| Service cards | Full width, then 250px and wrap |
| Tech balls | Wrap; each stays 112px. Thirteen canvases on a phone |
| Projects | 1 column, 2 from 640px, 3 from 1280px |
| Testimonials | Full width, then 320px cards in a wrap |
| Contact | Earth above form until 1280px; earth height 350px, 550px from 768px |
| Admin | Login `max-w-md`; add form `max-w-3xl`; both `pt-28` to clear the fixed nav |

Problems visible in code:

- Relative avatar path breaks off the homepage.
- Empty hash targets from admin.
- No horizontal-scroll lock is declared; long unbroken strings in a project description or URL could overflow.
- Tech section is a stack of WebGL canvases with no reduced experience on small screens.
- Hero is `h-screen` with text pinned at `top-[120px]` and a full-bleed canvas. On short mobile viewports the headline, computer, and scroll cue compete.
- `card-img_hover` does nothing, so the GitHub badge always covers the corner of the screenshot, including on touch devices where hover would never happen anyway.

---

## 10. Experience and career content

**The live site has no experience section, no job titles, no dates, no education block, no location, and no CV link.**

`react-vertical-timeline-component` is in `package.json` and is never imported. Company PNGs exist under `src/assets/company/` and are never rendered:

- Template leftovers: `meta.png`, `shopify.png`, `starbucks.png`, `tesla.png`
- Custom files present but unused: `rethestate.png`, `upwork.png`, `aptech.png`

These names appear only as testimonial affiliations or as unused files. They are not job entries.

**Testimonials, exact text** from `src/constants/index.js`:

1. “I thought it was impossible to make a website as beautiful as our product, but Rio proved me wrong.”  
   Nick Valladares, CFO of Rethestate. Image: local `Nick.png`.

2. “I've never met a web developer who truly cares about their clients' success like Rio does.”  
   Ani Cletus, General manager of Aptech. Image: `https://randomuser.me/api/portraits/men/5.jpg`.

3. “After Rio optimized our website, our traffic increased by 50%. We can't thank them enough!”  
   Lisa Wang, CTO of 456 Enterprises. Image: `https://randomuser.me/api/portraits/women/6.jpg`.

Card subtitle format in `Feedbacks.jsx` is `{designation} of {company}`.

**Not in this repository at all** (searched source): Rosario as a display name, KingMakers, Poltu, Voya, Wimik, Outrich, 8WTC, Tribe, Malta, dates such as April 2025. A redesign cannot pull that career history out of this codebase. It is not here.

The only email in UI code is `onwukachibike@gmail.com`, and only inside an error `alert` in `Contact.jsx`. `.env.example` comments that the EmailJS template “To Email” should be that address.

---

## 11. About and personal brand

The site does not use one title.

| Surface | Exact positioning |
|---|---|
| `index.html` `<title>` | `Riocodex \| Web3 Developer` |
| Navbar | `Riocodex` and `\| Software Engineer` |
| Hero | `Hi, I'm Rio` / `I design user interfaces, websites and blockchain applications` |
| About | `skilled Web Designer and Blockchain Developer` |
| Service cards | Ui/UX designer, Web Developer, Backend Developer, Web3 Developer |
| README | `My portfolio website.` |

**Primary impression from the words on the page:** Web3 / blockchain developer who also designs interfaces. “Software Engineer” appears only as a navbar suffix on desktop. “Full-stack”, “founder”, “product builder”, and “freelancer” are not used.

Specialties the copy emphasizes: responsive websites, dApps, React, Next.js, Material-UI, smart contracts, NFT marketplaces, DeFi, “seamless user experiences”, “merging creativity with technology”.

Next.js and Material-UI are named in About and are **not** in the technology ball list. Solidity **is** in the ball list.

GitHub URLs in the unused constants array use the handle `Riocodex`.

---

## 12. Skills and technologies

Hardcoded in `src/constants/index.js` as `technologies`. Rendered only by `Tech.jsx` as 3D balls. No categories, no percentages, no labels under the balls (the name exists in data and is not printed). Not dynamic.

Shown, in order:

HTML 5, CSS 3, JavaScript, TypeScript, React JS, Redux Toolkit, Tailwind CSS, Node JS, MongoDB, Three JS, git, figma, solidity.

Icons live in `src/assets/tech/`. `docker.png` exists and is exported from `src/assets/index.js` but is not in the array.

Service-card icons are a separate hardcoded list (`services`), not the same as the tech balls.

---

## 13. Contact system

File: `src/components/Contact.jsx`.

No public email address on the page. No phone. No social links. The form is the only contact UI.

Submit path:

1. If any EmailJS env var is missing, `alert("Contact form is not configured yet. Add your EmailJS keys to the .env file.")` and stop.
2. Otherwise `emailjs.send(serviceId, templateId, payload, publicKey)`.
3. Payload fields: `from_name`, `reply_to`, `from_email` (same as reply_to), `user_email` (same as reply_to), `message`.
4. Success: `alert("Thank you. I will get back to you as soon as possible.")`, then React state and the DOM form reset.
5. If the error text includes `Invalid grant` or `insufficient authentication`: alert telling the operator to reconnect Gmail in EmailJS.
6. Any other error: `alert("Something went wrong. Please try again or email me directly at onwukachibike@gmail.com")`.

Validation is HTML `required` plus `type="email"`. No custom format checks. Failures are browser alerts, not inline messages. Firebase is not involved.

There is no success state in the layout. The button disables while `loading` is true.

---

## 14. Admin and CMS

This is a minimal create-only CMS, not a dashboard.

**Authentication.** Firebase email/password. Session persists via the Firebase client SDK. `ProtectedRoute` only wraps `/add-project`.

**Authorization.** Any Firebase Auth user. Frontend does not check email or role. Rules do not either.

**What a signed-in user sees on the homepage.** In the Projects heading row: `+ Add Project` (links to `/add-project`) and `Log out`. Projects themselves stay public.

**Create.** Form described in section 4. Preview image is a local object URL, 230px tall, matching the card.

**Edit, delete, reorder, drafts, preview-as-visitor, image replace, tag editor.** Absent.

**Security observations (not fixed):**

1. Rules allow every authenticated user to create, update, and delete every project and to write any file under `projects/`. If email/password sign-up is enabled in the Firebase console, a stranger can obtain a user and write data even without using this UI. This repo has no sign-up screen, but rules do not depend on that.
2. Update and delete are allowed by rules and unreachable in the UI, so they can still be done with the client SDK or REST API by anyone who can sign in.
3. There is no admin email constraint, App Check, or file-type/size rule in Storage rules. The 2MB limit is client-side only.
4. Upload path uses the raw filename.
5. `/admin/login` is public. Security is the Firebase password plus rules, not a hidden URL.
6. The Firebase web API key is expected to ship in the client bundle. That is normal for Firebase. Protection has to be rules and Auth settings.
7. Public read of all project documents and all `projects/` files is intentional for a portfolio and leaves no room for private drafts.
8. Contact and admin failures use `alert()`, which can expose operational hints (rule file names, Gmail reconnect steps, the personal email).

No passwords, tokens, or key values are stored in the source files that were read. They are env-only. `.env` is gitignored.

---

## 15. Reusable pieces

| Piece | File | Props / API | Used by | Redesign note |
|---|---|---|---|---|
| `SectionWrapper` | `src/hoc/SectionWrapper.jsx` | `(Component, idName)` HOC | About, Tech, Works, Feedbacks, Contact | Visual shell. Hash ids `about`, `projects`, `contact` are behavioral. |
| `styles` | `src/styles.js` | class strings | Most sections and admin | Purely visual. |
| `motion` helpers | `src/utils/motion.js` | variant factories | Sections, admin | Visual. `zoomIn` unused. |
| `Navbar` | `src/components/Navbar.jsx` | none | Home and both admin pages | Mixed: hash links and scroll behavior are functional. |
| `ProjectCard` | inside `Works.jsx` | index, name, description, tags, image, source_code_link, website_link | Works only | Link behavior must be preserved or deliberately replaced. Not a separate file. |
| `useProjects` | `src/hooks/useProjects.js` | returns `{ projects, loading, error, addProject, refresh }` | Works, AddProject | **Functional. Keep.** |
| `fetchProjects` / `addProject` | `src/utils/projectsStorage.js` | field object in; documents out | the hook | **Functional. Keep.** |
| `AuthProvider` / `useAuth` | `src/context/AuthContext.jsx` | `{ user, loading, logout }` | App, Works, ProtectedRoute | **Functional. Keep.** |
| `ProtectedRoute` | `src/components/ProtectedRoute.jsx` | `children` | `/add-project` | **Functional. Keep.** |
| `normalizeUrl` | inside `Works.jsx` | url string | ProjectCard | Small but easy to lose if the card is rewritten. |
| Canvas components | `src/components/canvas/*` | `BallCanvas` takes `icon` | Hero, Tech, Contact, App | Visual. Expensive. |
| `CanvasLoader` | `src/components/Loader.jsx` | none | All canvases except stars | Only needed if 3D stays. |
| `ServiceCard`, `FeedbackCard` | inside About and Feedbacks | content fields | those sections only | Presentational. |

`src/components/index.js` is a barrel used by `App.jsx`. Admin pages import `Navbar` directly, not through the barrel.

---

## 16. Data flow

**Read path**

```text
Firebase Firestore collection "projects"
        │
        ▼
projectsStorage.fetchProjects()
  getDocs → mapDoc (id, fields, tags default [])
  → sortByCreatedAt (newest first, client-side)
        │
        ▼
useProjects()  on mount
  state: projects, loading, error
        │
        ▼
Works.jsx
        │
        ▼
ProjectCard
  click → window.open(website_link or source_code_link)
  github icon → window.open(source_code_link)
```

There is no router step after the card. There is no project page.

**Write path**

```text
/admin/login
  signInWithEmailAndPassword
        │
        ▼
/add-project   ProtectedRoute (user required)
  AddProject form
        │
        ▼
useProjects.addProject()
        │
        ▼
projectsStorage.addProject()
  Storage upload  projects/{timestamp}-{filename}
  getDownloadURL
  Firestore addDoc
    name, description, source_code_link, website_link,
    image, tags: [], createdAt
        │
        ▼
local state prepend (no createdAt on that object)
navigate("/#projects")
        │
        ▼
Works mounts and fetches again
```

**Auth path**

```text
AuthProvider
  onAuthStateChanged(auth)
        │
        ├─ ProtectedRoute → redirect if !user
        └─ Works → show Add / Log out if user
```

**Contact path (separate)**

```text
Contact form → EmailJS (env ids) → alert
Firebase is not in this path
```

**Hardcoded content path**

```text
src/constants/index.js
  → Navbar (navLinks)
  → About (services)
  → Tech (technologies)
  → Feedbacks (testimonials)

constants.projects is exported and never imported by a component
```

Importing `navLinks` still evaluates `constants/index.js`, which imports the large unused project screenshots. Those images are pulled into the bundle even though the grid does not show them.

---

## 17. Hardcoded vs dynamic

| Content | Mode |
|---|---|
| Projects on the homepage | **Dynamic** — Firestore |
| Project images on the homepage | **Dynamic** — Storage URLs saved on the document |
| Project name, description, links | **Dynamic** fields |
| Project tags | Field exists; **admin always writes `[]`** |
| Project status, featured, order, slug | **Do not exist** |
| Legacy Metaversus / WeMakeClothes / Rethestate / Fashion Swipe | **Hardcoded and not rendered** |
| Hero copy | Hardcoded in `Hero.jsx` |
| About copy | Hardcoded in `About.jsx` |
| Service cards | Hardcoded `services` |
| Tech balls | Hardcoded `technologies` |
| Testimonials | Hardcoded `testimonials` |
| Nav labels | Hardcoded `navLinks` |
| Brand strings and document title | Hardcoded |
| Experience, education, CV | **Absent** |
| Social links | **Absent** |
| Contact email on the page | **Absent**; email only in an error alert |
| Contact delivery | Dynamic EmailJS env config |
| Admin auth | Dynamic Firebase Auth |
| Avatar | Hardcoded `public/me.jpeg` |
| 3D models and hero background | Hardcoded files |

---

## 18. Feature inventory

Actually present:

- Single-page dark portfolio at `/`
- Fixed navbar with scroll background and mobile menu
- Hash navigation to About, Projects, Contact
- Hero with 3D computer and looping scroll indicator
- About text and four service cards
- 3D technology ball row with no heading
- Firestore-backed project grid with loading, error, and empty states
- Project card opens website, else GitHub; separate GitHub button
- URL normalization (`https://` prefix)
- Authenticated “Add Project” and “Log out” on the projects section
- `/admin/login` email/password
- `/add-project` with image upload, 2MB client check, preview, Firestore write
- Protected route redirect
- Testimonials section
- EmailJS contact form with three alert outcomes
- 3D earth and starfield on the contact area
- Framer Motion section entrance
- Vercel SPA rewrite
- Firestore and Storage rules files for public read and authenticated write

Not present:

- Project detail pages
- Edit or delete
- Drafts, featured, categories, manual order
- Experience timeline (library installed, unused)
- Blog, theme switch, social links, CV download
- Footer
- SEO description or Open Graph
- Per-route document titles
- Signup or password reset
- Filtering or search
- Tests

---

## 19. Systems a redesign must not break

These are the functional dependencies. Replacing a visual component is safe only if the behavior listed with it is kept or intentionally redesigned.

1. **`src/firebase/config.js`** — imported by auth and by the data layer. A missing env var currently white-screens the entire app. Do not import this from a module that should render without Firebase unless that failure is handled.
2. **`src/utils/projectsStorage.js`** — collection name `projects` and field names `name`, `description`, `source_code_link`, `website_link`, `image`, `tags`, `createdAt`. Existing Firestore documents use these names. Renaming them without a migration hides or blanks live projects.
3. **`useProjects`** — Works and AddProject both depend on the return shape `{ projects, loading, error, addProject, refresh }`.
4. **`AuthContext` + `ProtectedRoute`** — `/add-project` redirect, and the conditional admin buttons in Works. `useAuth` throws if used outside `AuthProvider`. `AuthProvider` must stay above both the portfolio and the admin routes.
5. **Storage path and `image` URL** — cards assume `image` is a direct URL. Breaking upload or the public read rule makes every card image fail.
6. **Link behavior in `ProjectCard`** — `website_link` wins over `source_code_link`; GitHub is a separate control; `normalizeUrl` fixes schemeless links. Existing documents may have empty `website_link`.
7. **Hash ids** `about`, `projects`, `contact` — navbar, hero scroll cue, and the post-create `window.location.hash = "projects"` all depend on them. `SectionWrapper` is what emits those ids today.
8. **Admin routes** `/admin/login` and `/add-project` — not in the nav, but they are the publishing workflow. A new router that only has `/` will remove the CMS.
9. **`vercel.json` rewrite** — required so `/add-project` and `/admin/login` load the SPA on refresh.
10. **EmailJS env contract and payload keys** — `from_name`, `reply_to`, `from_email`, `user_email`, `message`. Changing input `name` attributes without updating the payload breaks the template.
11. **Navbar on admin pages** — both admin screens import it. A homepage-only navbar that assumes `#about` exists will strand those pages unless admin gets its own header or hash links are changed to `/#about`.
12. **Public image `public/me.jpeg`** — favicon and navbar. The navbar path is relative (`./me.jpeg`).

`constants.projects` is not on the live path. Deleting it does not change the current grid. It is the only in-repo copy of Metaversus, WeMakeClothes, and Rethestate descriptions and GitHub URLs.

---

## 20. Technical debt and problems

### Critical

- **Firestore and Storage rules trust any authenticated user** for create, update, and delete. The UI cannot edit or delete, but the rules can. There is no admin identity check.
- **The app cannot boot without Firebase env vars**, because config throws at import time and auth wraps every route. A contact-only or static page still depends on Firebase being configured.
- **No edit/delete UI** while rules allow both. The CMS can add projects and cannot fix a mistake except through the Firebase console or a hand-written script.

### Important

- **Thirteen-plus WebGL contexts** on one page (computer, one canvas per tech ball, earth, stars). Browsers cap WebGL contexts. Balls are the usual failure point of this template: later canvases go blank.
- **`constants/index.js` imports multi-megabyte images** for projects that are not rendered. Any import of `navLinks` still bundles them.
- **Unused `react-vertical-timeline-component`** and unused company logos. The original template’s Experience section was not carried into the UI.
- **Avatar URL `./me.jpeg` breaks on admin routes.**
- **Hash links in the shared navbar do nothing useful on admin routes.**
- **No 404 route.** Unknown paths are a blank dark screen.
- **SEO:** title is `Riocodex | Web3 Developer`. No meta description, no Open Graph, no Twitter card, no canonical, no per-route titles. Favicon MIME type says SVG and the file is JPEG.
- **Accessibility:** mobile menu is a clickable image; inputs and buttons use `outline-none` with no focus style; GitHub control is not keyboard-activatable; project image alts are generic; service alts are all `web-development`; heading levels skip around (`h1` in hero, then `h2`, contact is `h3`); no skip link; no `prefers-reduced-motion`; 3D scenes have no text alternative; errors use `alert()`.
- **Tilt `options` prop** is leftover from `react-tilt` and is likely ignored by `react-parallax-tilt`. On About, `options` is on a `div`.
- **`.card-img_hover` has no CSS.**
- **GitHub is required** to publish, so a private product with no repo cannot be added without a fake link.
- **Tags cannot be entered**, so the only tag UI never appears for projects created in this admin.
- **Two testimonials use randomuser.me stock portraits.** One claims a 50% traffic increase for “456 Enterprises”. That is a credibility problem visible in the source.
- **Brand strings disagree** (Web3 Developer vs Software Engineer vs Web Designer and Blockchain Developer vs Rio vs Riocodex).

### Minor

- `zoomIn` is unused. Navbar imports `logo` and does not use it.
- `green-pink-gradient` has an invalid quoted color fallback.
- `font-poppins` is not defined in the Tailwind theme.
- Grammar in the projects intro: “Following projects showcases”.
- Contact button is a different color from other primary buttons.
- `AddProject` fetches the full project list on mount and does not use it.
- Optimistic add omits `createdAt`. Harmless because the page immediately navigates and refetches.
- `StrictMode` double-fetches projects in development.
- Empty `id=""` on Tech and Feedbacks wrappers.
- `Works` sets `initial` and `animate` on cards inside a `whileInView` parent, so section stagger and card animation fight each other.
- Large rounded cards, heavy type, and trailing periods on every heading are template habits, not a design system with tokens beyond six colors.
- `dist/` exists locally from a previous build and is gitignored.
- No tests, no CI config in the repo, no `firebase.json`.

---

## 21. UI and UX diagnosis

The code supports the suspicion that this is a flashy developer-portfolio template, not a business or operator site.

**Information hierarchy.** The first screen spends its space on a 3D computer and two lines of copy. It does not say Rosario Onwuka, does not state a current role with a company, and does not offer “view work” or “contact” as buttons. The scroll mouse is the only next step. Projects are the fourth block, after services and an unlabeled ball grid. Testimonials sit above contact and are not in the nav. There is no experience proof anywhere in the layout.

**Visual hierarchy.** Headlines are very large and very heavy. Eyebrows are uppercase and tracked. Almost every section uses the same pattern, so nothing is more important than anything else. Purple, green-pink frames, gradient tag text, and 3D scenes are doing the “premium” work instead of the content.

**Typography and spacing.** Poppins at black weight on navy is the whole system. Body size and line height are readable. Section padding is generous. Cards are repetitive. The projects intro is generic template English.

**Readability.** Secondary gray `#aaa6c3` on `#050816` is the main reading color. It is usable at 17px and weaker at 12–14px (testimonial roles, card descriptions, tag text). Gradient-clipped tag text is decorative and easy to lose.

**Credibility.** The page claims Web3, dApps, smart contracts, NFT marketplaces, and DeFi in the About paragraph, then shows a skills toy and a project grid whose content is whatever was typed into Firebase. There is no employment record on the page. One testimonial states a 50% traffic gain next to a stock randomuser portrait and a company name “456 Enterprises”. Another testimonial is the stock line about never having met a developer who cares this much. That pattern reads as template filler. The navbar says Software Engineer and the title says Web3 Developer.

**Project presentation.** Projects are equal tiles: screenshot, name, paragraph, leave the site. There is no problem, role, status, or outcome. Private products cannot be represented honestly because the form requires a GitHub URL and the card’s job is to open a link. There is no case-study page.

**Calls to action.** Hero: none. Projects: leave the site. Contact: `Send`, after a playful placeholder (`What's your good name?`). No recruiter path, no CV, no “let’s talk” that reveals an email before the form fails.

**Recruiter experience.** They get a nickname, a Web3 title, a blockchain paragraph, a logo ball row, and external repos. They do not get dates, employers, location, or a CV.

**Potential client experience.** They are not told what kind of business problem this person takes on. Services are “Ui/UX designer / Web Developer / Backend Developer / Web3 Developer”, which is a skill menu, not an offer.

**Mobile.** The structure collapses in a straightforward way, but the first screen is still a full-viewport 3D scene, the tech row is still thirteen canvases, and the contact earth still stacks above the form. The menu works only by pointer. That is a demo portfolio on a phone, not a document you read.

**Motion.** Entrance motion is moderate. The identity of the site is the 3D set pieces: computer, balls, earth, stars. Those are the effects that make it feel like a coding showcase. Removing only the hero sentence and keeping these scenes would leave the same genre of site.

---

## 22. What is already worth keeping

- The **Firebase project pipeline** is small and real: Auth session, one collection, image upload, public read, sorted list, loading/error/empty. A visual redesign can keep `projectsStorage.js`, `useProjects.js`, `AuthContext.jsx`, and `ProtectedRoute.jsx` and replace the cards.
- **Field names already stored in Firestore** are the contract with live data. New UI should read `name`, `description`, `image`, `source_code_link`, `website_link`, `tags`, `createdAt`, and `id`.
- **Link rules** (website preferred, GitHub separate, `https` normalization, new tab) are deliberate and easy to lose in a rewrite.
- **Admin create flow** including the 2MB check, storage/firestore error messages, and redirect to `/#projects`.
- **EmailJS wiring**, including the Gmail-reconnect branch and the fallback address in the failure alert. The form layout can change; the payload keys should not, unless the EmailJS template is updated with them.
- **Vercel rewrite** so deep links survive.
- **`public/me.jpeg`** as the existing portrait.
- **Legacy copy in `constants.projects`** if those three projects still matter: Metaversus, WeMakeClothes, Rethestate, their descriptions, tags, and GitHub URLs. They are not on the website today. Fashion Swipe is commented out, with a MERN description and `https://github.com/Riocodex/E-commerce`.
- **Security rule files** as the intended access model, with the caveat that they are broader than the UI.

The 3D scenes, tilt cards, gradient frames, tech balls, testimonial stack, and “Overview.” heading pattern are the template. They are not required for the Firebase system to work.

---

## 23. Screen-by-screen

**HOME.** Dark navy, full-bleed. A fixed bar holds a small photo, the word Riocodex, and on wider screens the words Software Engineer. Right side: About, Projects, Contact in muted lavender. The first screen is a textured dark hero. At the upper left, a purple dot and a fading purple line sit beside a huge white line, “Hi, I'm Rio”, with Rio in purple. Under it, a smaller lavender line about interfaces, websites, and blockchain applications. Most of the viewport is an interactive 3D desktop computer. At the bottom, a rounded mouse outline with a bouncing dot. Scroll. Next, “INTRODUCTION” and “Overview.”, a paragraph about web design and blockchain, then four tall dark cards with a green-to-pink edge and an icon: Ui/UX, Web, Backend, Web3. Then a band of floating beige spheres with technology logos and no title. Then “MY WORK” and “Projects.”, a gray paragraph, and a grid of dark cards with 230px screenshots, a GitHub circle on the image, a white title, and gray body text. Then a darker band, “WHAT OTHERS SAY” / “Testimonials.”, with quote cards overlapping upward, a huge quotation mark, a name, a role, and a round photo. Then “GET IN TOUCH” / “Contact.”: a dark form (name, email, message, Send) beside a rotating 3D earth, pink stars behind that area. No footer.

**ADMIN LOGIN.** Same dark page and the same navbar. Below it, a narrow dark panel, max about 28rem, headed “ADMIN” and “Login.” Email and password fields, a purple Sign in button, and a text link back to the portfolio.

**ADD PROJECT.** Same navbar and background. A wider dark panel, “PORTFOLIO” / “Add Project.” Stacked fields: name, description, GitHub, optional website, file input with a purple “choose file” chip, a 230px preview after selection, then purple “Add Project” and a dark “Cancel”.

**ANY OTHER URL.** Empty dark page. No navbar, no message.

---

## 24. Files and redesign risk

### Safe to redesign (presentation)

These can be restyled or replaced if the behaviors in section 19 are reconnected.

- `src/components/Hero.jsx`
- `src/components/About.jsx`
- `src/components/Tech.jsx`
- `src/components/Feedbacks.jsx`
- `src/components/Contact.jsx` — keep EmailJS field names and env reads
- `src/components/Navbar.jsx` — keep a working way home and a working way to projects/contact; fix admin hash links if the same component stays
- `src/components/canvas/*` and `src/components/Loader.jsx` — removable if 3D is dropped
- `src/styles.js`
- `src/index.css`
- `tailwind.config.cjs`
- `src/utils/motion.js`
- `src/hoc/SectionWrapper.jsx` — replaceable if hash targets are recreated
- `src/constants/index.js` — copy and lists; do not assume `projects` is live
- `index.html` — title and meta are where SEO lives today
- `src/App.jsx` — section order only; route table is functional

The visual layer of `src/components/Works.jsx` and `src/pages/AddProject.jsx` / `AdminLogin.jsx` can change. Their data calls should not.

### Careful — functional logic inside UI files

- `src/components/Works.jsx` — fetch hook, auth buttons, `normalizeUrl`, click vs GitHub, empty/error/loading
- `src/pages/AddProject.jsx` — validation, 2MB limit, `tags: []`, upload through the hook, redirect hash
- `src/pages/AdminLogin.jsx` — `signInWithEmailAndPassword`, navigate to `/add-project`
- `src/components/Contact.jsx` — EmailJS payload and alerts
- `src/components/Navbar.jsx` — hash targets, scroll listener, mobile toggle
- `src/App.jsx` — route paths and provider order
- `src/components/index.js` — barrel; App imports from here

### Avoid changing unless the data model is being migrated on purpose

- `src/firebase/config.js`
- `src/utils/projectsStorage.js`
- `src/hooks/useProjects.js`
- `src/context/AuthContext.jsx`
- `src/components/ProtectedRoute.jsx`
- `firestore.rules`
- `storage.rules`
- `vercel.json`
- `.env.example` (names, not secrets)
- Existing Firestore documents and Storage objects (not in git)

`public/me.jpeg`, `public/desktop_pc/`, and `public/planet/` are assets. The portrait is content. The GLTF folders matter only while those scenes stay.

---

## 25. Final report

### A. What the website currently is

A dark, single-page 3D portfolio branded **Riocodex / Rio**, visually descended from the “3dfolio” developer-portfolio template. Public visitors scroll one page. Projects are loaded from Firebase and open external links. A hidden admin flow can add projects. The page positions him as a Web3 and blockchain developer who designs interfaces. It does not present a career timeline, case studies, or the name Rosario Onwuka.

### B. Technology stack

React 18, React Router 6, Vite 4, Tailwind 3, Framer Motion 9, Three.js with React Three Fiber and drei, react-parallax-tilt, Firebase 12 (Auth, Firestore, Storage), EmailJS. Deployed as a Vercel SPA (`vercel.json`). JavaScript, not TypeScript.

### C. Architecture

`index.html` → `src/main.jsx` → `src/App.jsx`. `BrowserRouter` + `AuthProvider` wrap three routes. `/` composes Navbar, Hero, About, Tech, Works, Feedbacks, Contact, Stars. Admin pages are separate routes that reuse the navbar. Content constants live in `src/constants/index.js`. Project IO lives in `src/utils/projectsStorage.js`.

### D. Firebase architecture

Client SDK only. Env names: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`. Collection `projects`. Storage prefix `projects/`. Public read. Any signed-in user can write. Missing env vars throw before render.

### E. Dynamic project publishing

Create-only. `/admin/login` → `/add-project` → image upload → `addDoc` with `name`, `description`, `source_code_link`, `website_link`, `image`, `tags: []`, `createdAt` → redirect to `/#projects` → `getDocs` → newest first → cards. No edit, delete, draft, featured flag, category, slug, or detail route. Card click prefers `website_link`, else GitHub.

### F. Page and route inventory

- `/` public homepage
- `/admin/login` public sign-in, unlinked
- `/add-project` authenticated create form
- In-page anchors: `#about`, `#projects`, `#contact`
- No project pages, no 404

### G. Current visual design

Navy `#050816`, text `#aaa6c3`, white black-weight Poppins headlines, purple `#915EFF`, green-pink card edges, large radii, one soft card shadow, hero photo background, 3D computer, floating tech balls, rotating earth, pink starfield. No light theme. No glass. Template section pattern: small uppercase label, huge “Word.” heading.

### H. Current personal positioning

Inconsistent, and Web3-led. Title: `Riocodex | Web3 Developer`. Hero: “Hi, I'm Rio” / “I design user interfaces, websites and blockchain applications”. About: “Web Designer and Blockchain Developer” with dApps, smart contracts, NFTs, DeFi. Navbar desktop suffix: Software Engineer. Services: Ui/UX, Web, Backend, Web3.

### I. Existing content

Hero and About as quoted in sections 6 and 11. Thirteen technologies in section 12. Three testimonials in section 10, two with stock photos. Unused in-repo project blurbs: Metaversus (Next.js, Tailwind, Framer Motion; clothing customization; `https://github.com/Riocodex/Metaversus/tree/main`), WeMakeClothes (React, Tailwind, Three.js; `https://github.com/Riocodex/threejjs`), Rethestate (React, Solidity, web3js; NFT real-estate marketplace; `https://github.com/Riocodex/RealNFT`). Commented Fashion Swipe MERN text and `https://github.com/Riocodex/E-commerce`. Live project text is not in git; it is in Firestore. No jobs, dates, CV, or social links. Email `onwukachibike@gmail.com` only in a failure alert.

### J. Existing features

Dynamic project list, image upload, auth-gated create, EmailJS form, hash nav, mobile menu, 3D scenes, motion on scroll, Vercel SPA routing. No detail pages, no CMS beyond create, no experience section, no SEO metadata beyond the title.

### K. Admin / CMS

Email/password Firebase login, one protected form, no dashboard. Signed-in users see Add and Log out on the projects heading. Rules are wider than the UI (update/delete allowed, any auth user).

### L. Dynamic vs hardcoded

Dynamic: the project grid, project images, project links, auth, EmailJS delivery. Hardcoded: hero, about, services, skills, testimonials, nav, brand, 3D assets. Unused hardcoded projects in `constants`. Experience content is missing, not hardcoded.

### M. Strongest parts

A small, working Firestore/Storage publishing path; clear field names; public site and admin separated by route and auth; loading and error states on the grid; link normalization; rules files checked into the repo; Vercel rewrite so admin URLs refresh.

### N. Weakest parts

Template 3D portfolio presentation; conflicting Web3 vs software-engineer positioning; no proof of employment on the page; projects as equal external-link cards; create-only CMS that requires GitHub; testimonials with stock images and a numeric claim; no SEO; WebGL weight; rules that let any logged-in user modify all projects.

### O. Systems that must survive a redesign

`firebase/config.js`, `projectsStorage.js` field contract, `useProjects`, `AuthContext`, `ProtectedRoute`, routes `/admin/login` and `/add-project`, Storage public URLs, `vercel.json`, EmailJS payload keys, hash or equivalent links used after project creation, and any existing Firestore documents. Do not rename Firestore fields without migrating data.

### P. Files most likely to change in a visual redesign

Hero, About, Tech, Works (markup), Feedbacks, Contact (markup), Navbar, App section list, `styles.js`, `index.css`, `tailwind.config.cjs`, `SectionWrapper`, `motion.js`, canvas components, `constants/index.js`, `index.html`. Treat Works, AddProject, AdminLogin, Contact, App routes, and Navbar as mixed files. Leave the Firebase data layer, auth, protected route, rules, and `vercel.json` alone unless the data model is an explicit task.

### Q. Security and technical observations

Any Firebase-authenticated user can write projects and storage under current rules. There is no role check. Client-side 2MB and image-type checks are not in Storage rules. Filenames are not sanitized. Admin URL obscurity is not access control. The site crashes if Firebase env vars are absent. No secrets were found hardcoded in the files reviewed; keys are `VITE_*` env vars.

### R. What another engineer needs to know before redesigning

This repository does not contain Rosario’s current career or product narrative. KingMakers, Malta, Outrich, restaurant software, Voya, Wimik, 8WTC, and Tribe are not in the code. The live project list is in Firebase, and this audit could not read that database. The only project stories in git are the unused constants, and they describe Metaversus, WeMakeClothes, and an NFT real-estate marketplace.

The homepage will look empty or show “No projects yet.” if Firebase env vars are missing or the collection is empty, and it will not render at all if those env vars are missing, because config throws.

A redesign that only swaps colors and the hero sentence will still be this template, because the identity is the 3D computer, the tech balls, the earth, the starfield, the tilt cards, and the “Overview. / Projects. / Testimonials.” structure.

The publishing system is reusable only at the level of “title, paragraph, one image, GitHub, optional website.” It cannot represent a private product, a built-vs-in-progress split, or a case study until the schema and the admin form grow. Those fields do not exist yet. Adding them is a data-model change, not a CSS change.

Navbar hash links, the hero `#about` control, and `window.location.hash = "projects"` are part of the publishing UX. Admin pages currently mount the marketing navbar, which is wrong off `/`. The portrait path `./me.jpeg` is also wrong off `/`; the file that works is `public/me.jpeg` as `/me.jpeg`.
