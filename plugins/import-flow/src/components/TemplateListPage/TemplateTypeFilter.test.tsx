/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render } from '@testing-library/react';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { ExcludeTagFilter, TemplateTagFilter } from './filters';
import { TemplateTypeFilter } from './TemplateTypeFilter';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
}));

describe('TemplateTypeFilter', () => {
  const mockUpdateFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useEntityList as jest.Mock).mockReturnValue({
      updateFilters: mockUpdateFilters,
    });
  });

  it('renders nothing', () => {
    const { container } = render(
      <TemplateTypeFilter requiredTags={['bwce']} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('calls updateFilters with a TemplateTagFilter when requiredTags are set', () => {
    render(<TemplateTypeFilter requiredTags={['bwce', 'react']} />);

    expect(mockUpdateFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        templateTags: expect.any(TemplateTagFilter),
      }),
    );
    const { templateTags } = mockUpdateFilters.mock.calls[0][0];
    expect(templateTags.values).toEqual(['bwce', 'react']);
  });

  it('calls updateFilters with an ExcludeTagFilter when excludedTags are set', () => {
    render(<TemplateTypeFilter excludedTags={['import-flow', 'internal']} />);

    expect(mockUpdateFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        templateTags: expect.any(ExcludeTagFilter),
      }),
    );
    const { templateTags } = mockUpdateFilters.mock.calls[0][0];
    expect(templateTags.values).toEqual(['import-flow', 'internal']);
  });

  it('applies both TemplateTagFilter and ExcludeTagFilter when both props are provided', () => {
    render(
      <TemplateTypeFilter
        requiredTags={['react']}
        excludedTags={['import-flow']}
      />,
    );

    const filterArg = mockUpdateFilters.mock.calls[0][0];
    expect(filterArg.templateTags).toBeInstanceOf(TemplateTagFilter);
    expect(filterArg.templateTags.values).toEqual(['react']);
    expect(filterArg.excludeTemplateTags).toBeInstanceOf(ExcludeTagFilter);
    expect(filterArg.excludeTemplateTags.values).toEqual(['import-flow']);
  });

  it('does not call updateFilters when no tags are provided', () => {
    render(<TemplateTypeFilter />);
    expect(mockUpdateFilters).not.toHaveBeenCalled();
  });

  it('does not call updateFilters when props are empty arrays', () => {
    render(<TemplateTypeFilter requiredTags={[]} excludedTags={[]} />);
    expect(mockUpdateFilters).not.toHaveBeenCalled();
  });

  it('reapplies the filter when requiredTags change', () => {
    const { rerender } = render(<TemplateTypeFilter requiredTags={['bwce']} />);
    expect(mockUpdateFilters).toHaveBeenCalledTimes(1);

    rerender(<TemplateTypeFilter requiredTags={['bwce', 'react']} />);
    expect(mockUpdateFilters).toHaveBeenCalledTimes(2);

    const { templateTags } = mockUpdateFilters.mock.calls[1][0];
    expect(templateTags.values).toEqual(['bwce', 'react']);
  });

  it('reapplies the filter when excludedTags change', () => {
    const { rerender } = render(
      <TemplateTypeFilter excludedTags={['import-flow']} />,
    );
    expect(mockUpdateFilters).toHaveBeenCalledTimes(1);

    rerender(<TemplateTypeFilter excludedTags={['import-flow', 'internal']} />);
    expect(mockUpdateFilters).toHaveBeenCalledTimes(2);

    const { templateTags } = mockUpdateFilters.mock.calls[1][0];
    expect(templateTags.values).toEqual(['import-flow', 'internal']);
  });
});
