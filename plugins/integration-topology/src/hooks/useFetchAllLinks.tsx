/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Entity, EntityLink } from '@backstage/catalog-model';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { JsonArray } from '@backstage/types';
import { useState, useEffect, useCallback, useRef } from 'react';

export interface PlatformLink {
  pLink: string;
  pLabel: string;
  pAppType: string;
}

export const useFetchAllLinks = (entity: Entity | null | undefined) => {
  const [cpLink, setCpLink] = useState('');
  const [externalLinks, setExternalLinks] = useState<EntityLink[]>([]);
  const [infoLinks, setInfoLinks] = useState<{
    docs?: string;
    apis?: string;
    cicd?: string;
    source?: string;
  }>({});
  const [platformLinks, setPlatformLinks] = useState<PlatformLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if component is still mounted to prevent memory leaks
  const isMountedRef = useRef(true);

  const getPlatformLinks = useCallback(() => {
    let cpApps: any[] = [];
    const platformLinksArray: PlatformLink[] = [];

    if (
      entity?.metadata?.tibcoPlatformApps &&
      Array.isArray(entity.metadata.tibcoPlatformApps)
    ) {
      cpApps = entity.metadata.tibcoPlatformApps as JsonArray;
      for (const app of cpApps) {
        if (app && typeof app === 'object') {
          // Only create link if we have the required fields
          const appType = app.appType?.toString();
          const dpId = app.dpId?.toString();
          const capabilityInstanceId = app.capabilityInstanceId?.toString();
          const appId = app.appId?.toString();
          const dataPlaneName = app.dataPlaneName?.toString();

          if (
            appType &&
            dpId &&
            capabilityInstanceId &&
            appId &&
            dataPlaneName
          ) {
            platformLinksArray.push({
              pLink: `${cpLink}/cp/${appType.toLowerCase()}/appdetails/processes?dp_id=${dpId}&capability_instance_id=${capabilityInstanceId}&app_id=${appId}`,
              pLabel: dataPlaneName,
              pAppType: appType,
            });
          }
        }
      }
    }
    return platformLinksArray;
  }, [cpLink, entity]);

  const config = useApi(configApiRef);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const loadCpLink = async () => {
      try {
        const link = config.getOptionalString('cpLink');
        if (isMountedRef.current && link) {
          // Convert to string to handle edge cases where config returns non-string values
          setCpLink(String(link));
        }
      } catch (err: any | null) {
        setError(err?.toString());
      }
    };

    loadCpLink();
  }, [config]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    if (entity === null || entity === undefined) {
      return;
    }

    setPlatformLinks([]);
    if (cpLink && cpLink !== '') {
      const links = getPlatformLinks();
      if (isMountedRef.current) {
        setPlatformLinks(links);
      }
    }
  }, [entity, cpLink, getPlatformLinks]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    if (entity === null || entity === undefined) {
      return;
    }

    const namespace = entity?.metadata?.namespace || 'default';
    const kind = entity?.kind || 'Unknown';
    const name = entity?.metadata?.name || 'unknown';
    const detailsURL = `/catalog/${namespace}/${kind}/${name}`;

    // Reset links state
    setInfoLinks({});
    setExternalLinks([]);

    if (!isMountedRef.current) return;

    // Generate info links based on entity kind
    const newInfoLinks: typeof infoLinks = {};

    const entityKind = kind.toLowerCase();

    if (
      entityKind === 'component' ||
      entityKind === 'api' ||
      entityKind === 'resource'
    ) {
      newInfoLinks.docs = `${detailsURL}/docs`;
    }

    if (entityKind === 'component') {
      newInfoLinks.apis = `${detailsURL}/api`;
      newInfoLinks.cicd = `${detailsURL}/ci-cd`;
    }

    // When it is an API, go to the api definition page
    if (entityKind === 'api') {
      newInfoLinks.apis = `${detailsURL}/definition`;
    }

    // Add source link if available
    const sourceUrl = entity?.metadata?.annotations?.['backstage.io/view-url'];
    if (sourceUrl) {
      newInfoLinks.source = sourceUrl;
    }

    if (isMountedRef.current) {
      setInfoLinks(newInfoLinks);
    }

    if (entity?.metadata?.links && Array.isArray(entity.metadata.links)) {
      const links =
        entity.metadata.links.length > 3
          ? entity.metadata.links.slice(0, 3)
          : entity.metadata.links;

      if (isMountedRef.current) {
        setExternalLinks(links);
      }
    }
  }, [entity]);

  return { cpLink, externalLinks, infoLinks, platformLinks, error };
};
