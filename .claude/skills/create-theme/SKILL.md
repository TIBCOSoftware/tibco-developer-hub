---
name: create-theme
description: Create or replace a Backstage theme in this Developer Hub app, with an optional custom logo. Trigger when the user wants to add a new color theme, rebrand the app, change the sidebar logo, replace the default TIBCO theme, or create a customer-branded variant. Gathers palette/font/logo via AskUserQuestion, writes theme file(s) under packages/app/src/themes/, registers them in packages/app/src/App.tsx, wires the theme-aware logo swap in packages/app/src/components/Root/Root.tsx, type-checks with yarn tsc, and verifies in the browser via playwright when the dev server is running.
---

# create-theme

Add a new Backstage theme to this Developer Hub repo (or replace the default TIBCO one), with an optional custom logo and "Developer Hub" subtitle.

## Canonical template

**`packages/app/src/themes/tibcoThemeLight.ts` is the only theme in the repo** and the single source of truth for structure. Read it fully before generating a new file so your output matches the exact API surface.

It uses `createUnifiedTheme` + `createBaseThemeOptions` + `palettes.light` + `genPageTheme` from `@backstage/theme`. Don't invent a different builder.

**No dark theme ships in this repo.** If the user wants a dark variant you derive it from the light file — same structure, `palettes.dark` instead of `palettes.light`, and the color guidance in step 2. There is no dark template to copy from.

Note how the file is written today: colors are **inline hex literals** with explanatory trailing comments (`main: '#1774e5', // Changes inactive, clickable links, buttons, icons`), not named constants. Keep the comments as a map of what each knob drives, but do **not** copy the inline-literal style into your new file — see step 2.

## Workflow

### 1. Gather inputs (AskUserQuestion, batched)

Ask in a single tool call. Use multi-select where useful. Always offer "Other" for free-form via the built-in escape hatch.

- **Theme name** — kebab-case slug, e.g. `acme`, `customer-x`. Used in file names and theme IDs.
- **Variant** — Light only / Dark only / Both
- **Mode** — Add alongside TIBCO / Replace TIBCO
- **Primary brand color** — offer 3 example swatches (e.g. magenta `#d6336c`, deep blue `#1c7ed6`, forest `#2f9e44`) plus Other
- **Font family** — Inter / Roboto / IBM Plex Sans / Source Sans Pro / Other
- **Logo source** — URL / local path / none
- **Logo subtitle** — defaults to `Developer Hub`; ask the user, allow empty

### 2. Generate theme file(s)

Path: `packages/app/src/themes/<slug>ThemeLight.ts` (and/or `<slug>ThemeDark.ts`).

Copy the structure verbatim from `tibcoThemeLight.ts` — the same `createUnifiedTheme({ ...createBaseThemeOptions({ palette }), defaultPageTheme, fontFamily, pageTheme, components })` shape — and retarget every color.

`tibcoThemeLight.ts` writes its colors as inline hex literals. **Your new file should not.** Hoist them into named `const`s at the top and reference those throughout, so a rebrand is a handful of edits rather than a find-and-replace across 360 lines:

```ts
const BRAND_PRIMARY = '#...';
const BRAND_PRIMARY_DEEP = '#...';
const BRAND_SIDEBAR_BG = '#...';
const BRAND_TEXT_PRIMARY = '#...';
// etc.
```

Every TIBCO hex in the source (`#1774e5`, `#0e4f9e`, `#0E2D65`, `#565a6e`, …) maps to one of your tokens. When you are done, no raw hex literal should remain in the palette or in the component overrides — they should all reference a named token at the top. The status colors (`error` `#db0000`, `warning` `#fab632`, `info` `#a160fb`, `success` `#039145`) are semantic rather than brand; carry them over unchanged unless the user asks otherwise, but still name them.

Dark variant guidance:
- Base on `palettes.dark` (not `palettes.light`).
- Lighten the primary so it reads against dark backgrounds (e.g. `#d6336c` becomes `#ff5c8a`).
- Flip text colors (`#212121` → `#f4f4f8`-ish).
- Set very dark `background.default` (e.g. `#0f0f1a`) and slightly lighter `paper` (e.g. `#1a1a2e`).
- Use jewel-toned `pageTheme` gradients tuned for contrast against dark.

#### Dark theme: audit static CSS for hardcoded text colors

The MUI theme only drives elements that read from `theme.palette`. Plain CSS files in the repo that hardcode `color: #212121` (or any dark hex) will render dark-on-dark in any dark theme and look "broken" — the symptom is text that's invisible against the background until you select it. This is a project-level bug, not a theme bug, and it affects **every** dark theme equally.

Known affected files (already patched in this repo — verify they still look theme-agnostic before generating a new dark theme):
- `packages/app/src/components/home/components/Welcome/Welcome.css`
- `packages/app/src/components/home/components/Introduction/Introduction.css`

Fix pattern, if you find a hardcoded color in a static CSS file:
- For **primary** text (`color: #212121`, `#1a1a2e`, etc.): delete the `color:` declaration entirely so the element inherits the active theme's text color.
- For **muted/secondary** text (`color: #727272`, gray variants): replace with `opacity: 0.7` (or 0.6) — the element then inherits the theme's text color and renders subdued on both light and dark.

Before generating a dark variant, grep the relevant component tree for `color: #` in `.css` files (`rg "color:\s*#" packages/app/src/components`) and patch any new hardcoded values. After fixing, re-screenshot the home page on a dark theme to confirm.

### 3. Register in App.tsx

File: `packages/app/src/App.tsx`.

- Import each new theme file at the top alongside `tibcoThemeLight`.
- If adding a dark variant and `DarkIcon` isn't already imported, add: `import DarkIcon from '@material-ui/icons/Brightness4';`
- Append entries to the `themes:` array inside `createApp({...})`:

```ts
{
  id: '<slug>-light' /* or -dark */,
  title: '<Name> Light' /* or Dark */,
  variant: 'light' /* or 'dark' */,
  icon: <LightIcon /> /* or <DarkIcon /> */,
  Provider: ({ children }) => (
    <UnifiedThemeProvider theme={<imported theme>} children={children} />
  ),
},
```

If **Replace TIBCO** was chosen: remove the `tibco-theme` entry from the array. **Leave `tibcoThemeLight.ts` on disk** — don't delete the file unless explicitly asked. You can also leave the import; it's harmless.

### 4. Handle logo (if provided)

Asset path: `packages/app/src/components/Root/images/<slug>-logo.<ext>`.

- **URL source**: download with `curl -sSL -o <path> '<url>'`. The sandbox blocks network in Bash by default; retry with `dangerouslyDisableSandbox: true`.
- **Local path source**: copy the file with `cp`.
- **None**: skip this step entirely; the default DevHub logo continues to show.

Then edit `packages/app/src/components/Root/Root.tsx`. **Read the file first** — the descriptions below are the shape it has today, and it is a 600-line file with several unrelated `makeStyles` blocks.

What is actually there:

- A single unconditional logo import near the other asset imports: `import DevHubLogo from './images/devhub-logo.svg';`
- `useSidebarLogoStyles` — classes `logoContainer`, `logoContainerClosed`, `logo`, `menuIcon`, `img` (`img` is just `{ height: '45px' }`)
- The `SidebarLogo` component, which renders a hamburger `TibcoIcon` as the `SidebarItem` icon and, as its child, `<Link to="/"><img src={DevHubLogo} className={classes.img} alt="logo" /></Link>`

There is **no theme-aware logo swap and no subtitle** in the file — you are adding both, not extending an existing mechanism.

1. Add the asset import next to the existing `DevHubLogo` import:
   ```ts
   import <Slug>Logo from './images/<slug>-logo.<ext>';
   ```
2. **Replace TIBCO** — the simple case, and the default when only one theme is registered. Point the existing `<img>` at the new asset and stop. No API subscription, no branching.
3. **Add alongside TIBCO** — the logo now has to follow the active theme. `useApi` is already imported from `@backstage/core-plugin-api`; add `appThemeApiRef` to that same import and subscribe inside `SidebarLogo`:
   ```ts
   const appThemeApi = useApi(appThemeApiRef);
   const [themeId, setThemeId] = useState(appThemeApi.getActiveThemeId());
   useEffect(() => {
     const sub = appThemeApi.activeThemeId$().subscribe(setThemeId);
     return () => sub.unsubscribe();
   }, [appThemeApi]);

   const is<Slug> = themeId === '<slug>-light' || themeId === '<slug>-dark';
   ```
   `useState` and `useEffect` are already imported at the top of the file. Then pick the asset: `const logoSrc = is<Slug> ? <Slug>Logo : DevHubLogo;` and render `<img src={logoSrc} … />`.
4. **Subtitle requested** — add three classes to `useSidebarLogoStyles` (they do not exist yet) and render a stack in place of the bare `<img>`:
   ```ts
   logoStack: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
   logoImg: { height: '38px' },
   logoText: { fontSize: '12px', letterSpacing: '0.04em', opacity: 0.85 },
   ```
   ```tsx
   <div className={classes.logoStack}>
     <img src={logoSrc} className={classes.logoImg} alt="logo" />
     <span className={classes.logoText}>{subtitle}</span>
   </div>
   ```
   Keep it inside the existing `<Link to="/">`. Don't render the subtitle in the collapsed sidebar — `isOpen` from `useSidebarOpenState()` is already in scope in `SidebarLogo`.
5. **No subtitle**: leave the single `<img className={classes.img}>` flow as it is; only the `src` changes.

### 5. Type-check

```sh
yarn tsc
```

From the repo root. Must exit `0` before reporting done. Backstage CLI's webpack config already handles PNG/SVG imports — no `.d.ts` declarations needed for new asset types.

### 6. Verify in browser (best-effort)

If `http://localhost:3000` is listening (the dev server is running), use the playwright MCP tools to:

1. Navigate to `http://localhost:3000/settings`.
2. Click the new theme button in the Appearance section (`button:has-text("<Name> Light")` etc.).
3. Navigate to `http://localhost:3000/` (home) **and** `http://localhost:3000/catalog`, screenshotting each.
4. Read the screenshots back and confirm: sidebar logo + colors look right, **and on dark variants every line of body text on the home page is clearly readable**. If text is invisible/blends into the background, see "Dark theme: audit static CSS" in step 2 — fix the offending CSS file, not the theme.
5. Switch back to the previously active theme so the user's session is untouched.

If the dev server isn't running, skip this step and tell the user to run `yarn start` and check the Appearance picker themselves.

## Theme surface (full knob reference)

| Group | Knobs |
|---|---|
| Palette | `primary.main`, `secondary.main`, `error.main`, `warning.main`, `info.main`, `success.main`, `background.default`, `background.paper`, `banner.{info,error,text,link}`, `errorBackground`, `warningBackground`, `infoBackground`, `navigation.{background,indicator,color,selectedColor,navItem.hoverBackground}` |
| Global | `defaultPageTheme` (use `'other'`), `fontFamily`, `htmlFontSize` (16) |
| pageTheme | `service`, `library`, `website`, `integration`, `messaging`, `other` — each `genPageTheme({ colors: [hex], shape: 'none' })` |
| components.styleOverrides | `MuiMenuItem`, `MuiTableSortLabel`, `MuiButton`, `MuiButtonBase`, `MuiLink`, `MuiTypography`, `MuiTableBody`, `CatalogReactUserListPicker`, `OAuthRequestDialog`, `BackstageDismissableBanner`, `BackstageHeader`, `BackstageHeaderLabel`, `PluginCatalogEntityContextMenu`, `BackstageItemCardHeader`, `BackstageSidebarPage`, `BackstageSidebar`, `BackstageSidebarItem` |

## Don't

- Don't hardcode TIBCO blue (`#1774e5`, `#0e4f9e`, `#0E2D65`, `#13405B`) anywhere in the new theme — every color in component overrides should reference a named token from the top of the file.
- Don't add font-face CSS under `themes/styles/` unless the user explicitly asks. Inter, Roboto, etc. fall back gracefully if not installed locally.
- Don't delete `tibcoThemeLight.ts` from disk when replacing it; just unregister in App.tsx.
- Don't render a `<span>Developer Hub</span>` subtitle when the logo image already has brand text baked in (e.g. an SVG with a wordmark).
- Don't skip the `yarn tsc` step. If it fails, fix the new file rather than `// @ts-ignore`-ing.
- Don't assume the MUI theme drives all text color — static `.css` files in the repo can hardcode `color:` and break dark themes. If a dark variant looks unreadable on the home page (or anywhere else), audit nearby `.css` files first; don't tune the dark palette to compensate for an invisible-text bug that originates in static CSS.
