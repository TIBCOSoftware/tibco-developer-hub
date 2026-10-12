/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';

/**
 * Which flow a scaffolder template run belongs to.
 *
 * A run lives at /create/templates/:namespace/:name and is served by the shared
 * /create route, so the URL alone can't tell an import-flow / self-service /
 * marketplace run apart from a plain "Templates" run. `undefined` means "not on
 * a run page, or not resolved yet".
 */
export type RunFlowKind =
  | 'import'
  | 'self-service'
  | 'marketplace'
  | 'template'
  | undefined;

const RunFlowKindContext = createContext<RunFlowKind>(undefined);

/**
 * Reads the resolved flow kind for the current scaffolder run. Both the sidebar
 * (to highlight the right entry) and the run-page header (to show the right
 * title) consume this so they stay in sync and never flicker.
 */
export const useRunFlowKind = (): RunFlowKind => useContext(RunFlowKindContext);

/**
 * Resolves the current run's flow kind and shares it via context. The value is
 * resolved two ways and kept in state so it never flickers:
 *  1. Instantly, from the page the user navigated *from* when clicking "Choose"
 *     (useLayoutEffect, so no wrong frame is ever painted).
 *  2. Authoritatively, from the running template's tags (async catalog lookup),
 *     which also covers a direct load / refresh where there is no origin page.
 *
 * Must be rendered inside the router and above both the sidebar and the /create
 * route (see Root).
 */
export const RunFlowKindProvider = ({ children }: PropsWithChildren<{}>) => {
  const location = useLocation();
  const catalogApi = useApi(catalogApiRef);

  const runTemplateMatch = location.pathname.match(
    /\/create\/templates\/([^/]+)\/([^/]+)/,
  );
  const isRunPage = !!runTemplateMatch;
  const runNamespace = runTemplateMatch?.[1];
  const runName = runTemplateMatch?.[2];

  const [runFlowKind, setRunFlowKind] = useState<RunFlowKind>(undefined);
  const prevPathRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = location.pathname;
    if (!isRunPage) {
      setRunFlowKind(undefined);
      return;
    }
    // Derive the kind instantly from the page we navigated *from*. This effect
    // only re-runs when the pathname changes (isRunPage is derived from it), so
    // `prev` here is always the previous page, never the current one.
    if (prev?.startsWith('/import-flow')) {
      setRunFlowKind('import');
    } else if (prev?.startsWith('/self-service-flow')) {
      setRunFlowKind('self-service');
    } else if (prev?.startsWith('/marketplace')) {
      setRunFlowKind('marketplace');
    } else if (prev === '/create') {
      // Came from the Templates list.
      setRunFlowKind('template');
    } else {
      // Origin we can't map to a flow (direct load / refresh, or moving between
      // two run pages): reset to a neutral state and let the tag lookup resolve
      // the new template, rather than showing a stale/wrong flow.
      setRunFlowKind(undefined);
    }
  }, [location.pathname, isRunPage]);

  const {
    value: runTemplate,
    error: runTemplateError,
    loading: runTemplateLoading,
  } = useAsync(async () => {
    if (!isRunPage) {
      return undefined;
    }
    return catalogApi.getEntityByRef({
      kind: 'Template',
      namespace: runNamespace!,
      name: runName!,
    });
  }, [isRunPage, runNamespace, runName]);

  useEffect(() => {
    if (!isRunPage || runTemplateLoading) {
      // Wait for the lookup to settle before deciding, so we don't fall back
      // while it's still in flight.
      return;
    }
    if (runTemplate) {
      const tags = runTemplate.metadata.tags?.map(t => t.toLowerCase());
      if (tags?.includes('import-flow')) {
        setRunFlowKind('import');
      } else if (tags?.includes('self-service')) {
        setRunFlowKind('self-service');
      } else if (tags?.includes('devhub-marketplace')) {
        setRunFlowKind('marketplace');
      } else {
        setRunFlowKind('template');
      }
    } else {
      // Lookup settled with no entity: either it threw (network / auth) or it
      // resolved to undefined (entity not found / bad ref). Either way fall back
      // to a sensible default so the sidebar/header aren't left blank, but don't
      // clobber a kind we already derived from the navigation origin.
      setRunFlowKind(prev => prev ?? 'template');
    }
  }, [isRunPage, runTemplate, runTemplateError, runTemplateLoading]);

  return (
    <RunFlowKindContext.Provider value={runFlowKind}>
      {children}
    </RunFlowKindContext.Provider>
  );
};
