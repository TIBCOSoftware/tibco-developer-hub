/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useEffect } from 'react';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { ExcludeTagFilter, TemplateTagFilter } from './filters';

type TemplateTypeFilterProps = {
  requiredTags?: string[];
  excludedTags?: string[];
};

/**
 * A render-nothing component that registers a tag-based entity filter.
 * Applies a {@link TemplateTagFilter} when `requiredTags` are set, or an
 * {@link ExcludeTagFilter} when `excludedTags` are set.
 */
export const TemplateTypeFilter = ({
  requiredTags,
  excludedTags,
}: TemplateTypeFilterProps) => {
  const { updateFilters } = useEntityList();

  useEffect(() => {
    if (requiredTags?.length && excludedTags?.length) {
      updateFilters({
        // @ts-expect-error Custom filter key extending EntityFilter
        templateTags: new TemplateTagFilter(requiredTags),
        excludeTemplateTags: new ExcludeTagFilter(excludedTags),
      });
    } else if (requiredTags?.length) {
      updateFilters({
        // @ts-expect-error Custom filter key extending EntityFilter
        templateTags: new TemplateTagFilter(requiredTags),
        excludeTemplateTags: undefined,
      });
    } else if (excludedTags?.length) {
      updateFilters({
        // @ts-expect-error Custom filter key extending EntityFilter
        templateTags: new ExcludeTagFilter(excludedTags),
        excludeTemplateTags: undefined,
      });
    }
  }, [requiredTags, excludedTags, updateFilters]);

  return null;
};
