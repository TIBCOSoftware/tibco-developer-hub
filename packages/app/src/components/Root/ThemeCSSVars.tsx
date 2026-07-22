/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';

/**
 * Reads the active MUI/Backstage theme and writes --tpdh-* CSS custom
 * properties onto <html> so that CSS files (which cannot access MUI theme
 * values directly) stay in sync with the current theme.  Renders nothing.
 *
 * Strategy for colors with no exact palette match:
 *   isLight ? '<exact original TIBCO hex>' : <semantic palette fallback>
 * This gives zero visual regression on the light theme while ensuring dark
 * (and any future custom) themes render correctly.
 */
export const ThemeCSSVars = () => {
  const theme = useTheme<BackstageTheme>();

  useEffect(() => {
    const root = document.documentElement;
    const nav = theme.palette.navigation;
    const isLight = theme.palette.type === 'light';

    // ── Text ────────────────────────────────────────────────────────────────
    root.style.setProperty('--tpdh-text-primary', theme.palette.text.primary);
    root.style.setProperty(
      '--tpdh-text-secondary',
      theme.palette.text.secondary,
    );
    // Muted text: no exact palette match — preserve #464646 on light, use secondary on dark
    root.style.setProperty(
      '--tpdh-text-muted',
      isLight ? '#464646' : theme.palette.text.secondary,
    );

    // ── Backgrounds ─────────────────────────────────────────────────────────
    root.style.setProperty(
      '--tpdh-bg-default',
      theme.palette.background.default,
    );
    // bg-paper: light theme default #ffffff ≠ theme.background.paper (#fafafa); preserve for light
    root.style.setProperty(
      '--tpdh-bg-paper',
      isLight ? '#ffffff' : theme.palette.background.paper,
    );
    // bg-subtle: light theme default #f1f1f1 ≠ grey[100] (#f5f5f5); preserve for light
    root.style.setProperty(
      '--tpdh-bg-subtle',
      isLight ? '#f1f1f1' : theme.palette.grey[800],
    );

    // ── Borders ─────────────────────────────────────────────────────────────
    // border: light default #c8c5c5 ≠ theme.divider (rgba); preserve for light
    root.style.setProperty(
      '--tpdh-border',
      isLight ? '#c8c5c5' : theme.palette.divider,
    );
    // border-light: used for secondary sidebar panel border
    root.style.setProperty(
      '--tpdh-border-light',
      isLight ? '#ccc' : theme.palette.divider,
    );
    // border-subtle: tag/chip borders; light default #dedede ≠ divider
    root.style.setProperty(
      '--tpdh-border-subtle',
      isLight ? '#dedede' : theme.palette.divider,
    );

    // ── Primary brand ────────────────────────────────────────────────────────
    root.style.setProperty('--tpdh-primary', theme.palette.primary.main);
    root.style.setProperty('--tpdh-primary-dark', theme.palette.primary.dark);
    root.style.setProperty('--tpdh-primary-light', theme.palette.primary.light);
    root.style.setProperty(
      '--tpdh-primary-contrast',
      theme.palette.primary.contrastText,
    );
    // Active-state shadow: light #055dab has no exact palette equivalent
    root.style.setProperty(
      '--tpdh-primary-active-shadow',
      isLight ? '#055dab' : theme.palette.primary.dark,
    );

    // ── Error ────────────────────────────────────────────────────────────────
    root.style.setProperty('--tpdh-error', theme.palette.error.main);
    // error-dark: light default #8f0000 ≠ MUI auto-generated shade; preserve for light
    root.style.setProperty(
      '--tpdh-error-dark',
      isLight ? '#8f0000' : theme.palette.error.dark,
    );

    // ── Navigation ───────────────────────────────────────────────────────────
    root.style.setProperty(
      '--tpdh-nav-bg',
      nav?.background ?? theme.palette.primary.dark,
    );
    root.style.setProperty(
      '--tpdh-nav-hover-bg',
      nav?.navItem?.hoverBackground ?? theme.palette.primary.dark,
    );
    root.style.setProperty(
      '--tpdh-nav-text',
      nav?.color ?? theme.palette.common.white,
    );
    // Secondary sidebar panel background (#ebf4ff on light)
    root.style.setProperty(
      '--tpdh-nav-secondary-bg',
      isLight ? '#ebf4ff' : nav?.background ?? theme.palette.grey[900],
    );
    // Version text in sidebar footer (#C2D2E6 on light — already a light colour, works on dark too)
    root.style.setProperty(
      '--tpdh-nav-version-text',
      isLight ? '#C2D2E6' : theme.palette.text.secondary,
    );
  }, [theme]);

  return null;
};
