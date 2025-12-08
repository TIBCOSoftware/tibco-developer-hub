/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { searchApiRef, MockSearchApi } from '@backstage/plugin-search-react';
import { SearchResult } from '@backstage/plugin-search-common';
import { SearchByEntityName } from './SearchByEntityName';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

describe('<SearchByEntityName/>', () => {
  const mockSearchApi = new MockSearchApi({
    results: [
      {
        document: {
          title: 'test1',
          text: 'test1',
        },
      },
      {
        document: {
          title: 'test2',
          text: 'test2',
        },
      },
      {
        document: {
          title: 'test3',
          text: 'test3',
        },
      },
    ] as SearchResult[],
    // },
  });
  const mockEntity = [
    {
      name: 'test1',
      kind: 'component',
      description: 'Test Entity 1',
      namespace: 'default',
    },
  ];

  it('should display label and rootEntityName as placeholder', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );

    expect(screen.getByText('Search Entities by Name')).toBeInTheDocument();

    const inputElement = screen.getByRole('textbox', {
      name: 'Search',
    });
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'test1');
  });

  it('should update input value on new value typed', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );
    const inputElement = screen.getByRole('textbox', {
      name: 'Search',
    });
    expect(inputElement).toBeInTheDocument();
    await user.click(inputElement);
    await user.type(inputElement, 'test2');
    await user.keyboard('{enter}');
    expect(inputElement).toHaveValue('test2');
  });

  it('should return all values when input cleared', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );

    const inputElement = screen.getByRole('textbox', {
      name: 'Search',
    });
    expect(inputElement).toBeInTheDocument();
    await user.click(inputElement);
    await user.clear(inputElement);
    await waitFor(() => {
      expect(screen.getByText('test1')).toBeInTheDocument();
      expect(screen.getByText('test2')).toBeInTheDocument();
      expect(screen.getByText('test3')).toBeInTheDocument();
    });
  });

  it('should show search results options based on text typed', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );

    const inputElement = screen.getByRole('textbox', {
      name: 'Search',
    });
    expect(inputElement).toBeInTheDocument();
    await user.click(inputElement);
    await user.type(inputElement, 'test');

    await waitFor(() => {
      expect(screen.getByText('test1')).toBeInTheDocument();
      expect(screen.getByText('test2')).toBeInTheDocument();
      expect(screen.getByText('test3')).toBeInTheDocument();
      expect(screen.queryByText('group')).not.toBeInTheDocument();
    });
  });

  it('should be able to search and click on found search result', async () => {
    const { rerender } = await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );
    const inputElement = screen.getByRole('textbox', {
      name: 'Search',
    });
    await user.type(inputElement, 'test');
    await waitFor(() => {
      expect(screen.getByText('test1')).toBeInTheDocument();
      expect(screen.getByText('test2')).toBeInTheDocument();
    });
    await user.click(screen.getByText('test2'));
    const mockEntity2 = [
      {
        name: 'test2',
        kind: 'component',
        description: 'Test Entity 2',
        namespace: 'default',
      },
    ];
    await rerender(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity2}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );

    await waitFor(() => {
      const updatedInputElement = screen.getByRole('textbox', {
        name: 'Search',
      });
      expect(updatedInputElement).toHaveAttribute('placeholder', 'test2');
    });
  });

  it('should clear input and close the search results options list on clicking Clear button', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[searchApiRef, mockSearchApi]]}>
        <SearchByEntityName
          label="Search Entities by Name"
          rootEntityNames={mockEntity}
          onSelected={() => {}}
        />
      </TestApiProvider>,
    );

    const inputElement = screen.getByRole('textbox', {
      name: 'Search',
    });
    await user.type(inputElement, 'test');
    const buttonElement = screen.getByRole('button', {
      name: 'Clear',
    });
    expect(buttonElement).toBeInTheDocument();
    await user.click(buttonElement);
    expect(inputElement).toHaveAttribute('value', '');
    expect(inputElement).toHaveAttribute('placeholder', mockEntity[0].name);
  });
});
