---
name: create-theme
description: Create or replace a Backstage theme in this Developer Hub app, with an optional custom logo. Trigger when the user wants to add a new color theme, rebrand the app, change the sidebar logo, replace the default TIBCO theme, or create a customer-branded variant. Gathers palette/font/logo via AskUserQuestion, writes theme file(s) under packages/app/src/themes/, registers them in packages/app/src/App.tsx, wires the theme-aware logo swap in packages/app/src/components/Root/Root.tsx, type-checks with yarn tsc, and verifies in the browser via playwright when the dev server is running.
---

# create-theme

Add a new Backstage theme to this Developer Hub repo (or replace the default TIBCO one), with an optional custom logo and "Developer Hub" subtitle.

## Canonical templates

Two working themes already in the repo are the source of truth for structure. Read at least one fully before generating a new file so your output matches the exact API surface:

- Light template: `packages/app/src/themes/acmeThemeLight.ts`
- Dark template: `packages/app/src/themes/acmeThemeDark.ts`

Both use `createUnifiedTheme` + `createBaseThemeOptions` + `palettes.light` / `palettes.dark` + `genPageTheme` from `@backstage/theme`. Don't invent a different builder.

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

Copy structure verbatim from the relevant template (`acmeThemeLight.ts` / `acmeThemeDark.ts`) and retarget every color. Put palette tokens as `const`s at the top of the file:

```ts
const BRAND_PRIMARY = '#...';
const BRAND_PRIMARY_DEEP = '#...';
const BRAND_SIDEBAR_BG = '#...';
const BRAND_TEXT_PRIMARY = '#...';
// etc.
```

Replace every occurrence of the template's `ACME_*` constants with your `BRAND_*` constants. No raw hex literals scattered through component overrides — they should all reference the named tokens at the top.

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

Then edit `packages/app/src/components/Root/Root.tsx`:

1. Add the asset import next to the existing `AcmeLogo` import:
   ```ts
   import <Slug>Logo from './images/<slug>-logo.<ext>';
   ```
2. `appThemeApiRef` is already imported from `@backstage/core-plugin-api`. The active-theme subscription already exists in `SidebarLogo` — extend it. The existing pattern:
   ```ts
   const isAcme = themeId === 'acme-light' || themeId === 'acme-dark';
   ```
   Add a sibling check for your theme IDs, e.g.:
   ```ts
   const isCustomerX = themeId === 'customer-x-light' || themeId === 'customer-x-dark';
   ```
   Then expand the JSX to pick the right logo + subtitle for each branch.
3. **Subtitle requested**: render the stack pattern (already in the file as `acmeLogoStack` / `acmeLogoImg` / `acmeLogoText`):
   ```tsx
   <div className={classes.acmeLogoStack}>
     <img src={<Slug>Logo} className={classes.acmeLogoImg} alt="logo" />
     <span className={classes.acmeLogoText}>{subtitle}</span>
   </div>
   ```
4. **No subtitle**: render a single `<img>` with `classes.img` so it matches the existing single-image flow.

If "Replace TIBCO" was chosen and the user wants the new logo to be the default, you can simplify: just point `<img src={...}>` at the new asset unconditionally and drop the theme-ID checks for the logo branch. Confirm with the user first.

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
