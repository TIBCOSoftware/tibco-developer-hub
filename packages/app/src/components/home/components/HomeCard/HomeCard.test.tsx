/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { render, screen } from '@testing-library/react';
import { HomeCard } from './HomeCard';
import { HomeCardType, HomeCardProps } from '../../types';
import { BrowserRouter } from 'react-router-dom';

// Wrapper for components that need Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Helper to create minimal valid card data
const createCardData = (
  type: HomeCardType,
  overrides?: Partial<HomeCardProps>,
): HomeCardProps => ({
  type,
  loading: false,
  itemsInfo: [],
  subTitle: 'Test subtitle',
  icon: 'test-icon.svg',
  ...overrides,
});

describe('HomeCard', () => {
  describe('Card Titles', () => {
    it('should render "Self Service Flows" for SelfService type', () => {
      const cardData = createCardData(HomeCardType.SelfService);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Self Service Flows')).toBeInTheDocument();
    });

    it('should render singular title for Topology type', () => {
      const cardData = createCardData(HomeCardType.Topology);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Topology')).toBeInTheDocument();
    });

    it('should render singular title for MarketPlace type', () => {
      const cardData = createCardData(HomeCardType.MarketPlace);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Marketplace')).toBeInTheDocument();
    });

    it('should render plural titles for System type', () => {
      const cardData = createCardData(HomeCardType.System);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Systems')).toBeInTheDocument();
    });

    it('should render plural titles for Component type', () => {
      const cardData = createCardData(HomeCardType.Component);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Components')).toBeInTheDocument();
    });

    it('should render plural titles for API type', () => {
      const cardData = createCardData(HomeCardType.API);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('APIs')).toBeInTheDocument();
    });

    it('should render plural titles for Template type', () => {
      const cardData = createCardData(HomeCardType.Template);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Templates')).toBeInTheDocument();
    });

    it('should render plural titles for Document type', () => {
      const cardData = createCardData(HomeCardType.Document);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('should render plural titles for WalkThrough type', () => {
      const cardData = createCardData(HomeCardType.WalkThrough);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Walk-throughs')).toBeInTheDocument();
    });

    it('should render plural titles for ImportFlow type', () => {
      const cardData = createCardData(HomeCardType.ImportFlow);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Import Flows')).toBeInTheDocument();
    });
  });

  describe('Extra Info - Subtitles', () => {
    it('should display correct subtitle for Topology type', () => {
      const cardData = createCardData(HomeCardType.Topology);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Explore entity relationships'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for MarketPlace type', () => {
      const cardData = createCardData(HomeCardType.MarketPlace);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Explore marketplace items')).toBeInTheDocument();
    });

    it('should display correct subtitle for System type', () => {
      const cardData = createCardData(HomeCardType.System);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Start with a system of applications'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for Template type', () => {
      const cardData = createCardData(HomeCardType.Template);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Templates for Apps')).toBeInTheDocument();
    });

    it('should display correct subtitle for Component type', () => {
      const cardData = createCardData(HomeCardType.Component);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Browse application components'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for API type', () => {
      const cardData = createCardData(HomeCardType.API);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('View existing and create new APIs'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for Document type', () => {
      const cardData = createCardData(HomeCardType.Document);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Read development documentation'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for WalkThrough type', () => {
      const cardData = createCardData(HomeCardType.WalkThrough);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Development & functionality demos'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for SelfService type', () => {
      const cardData = createCardData(HomeCardType.SelfService);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Access self service flow capabilities'),
      ).toBeInTheDocument();
    });

    it('should display correct subtitle for ImportFlow type', () => {
      const cardData = createCardData(HomeCardType.ImportFlow);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(
        screen.getByText('Import existing applications'),
      ).toBeInTheDocument();
    });
  });

  describe('View All Link', () => {
    it('should render "View all" link for most card types', () => {
      const cardData = createCardData(HomeCardType.System);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('View all')).toBeInTheDocument();
    });

    it('should render "View all" link for WalkThrough when viewAllLink is provided', () => {
      const cardData = createCardData(HomeCardType.WalkThrough, {
        viewAllLink: 'https://example.com',
      });
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('View all')).toBeInTheDocument();
    });

    it('should not render "View all" link for WalkThrough when viewAllLink is not provided', () => {
      const cardData = createCardData(HomeCardType.WalkThrough);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.queryByText('View all')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display progress indicator when loading is true', () => {
      const cardData = createCardData(HomeCardType.System, { loading: true });
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByTestId('progress')).toBeInTheDocument();
    });

    it('should not display progress indicator when loading is false', () => {
      const cardData = createCardData(HomeCardType.System);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display "There are no Systems" when itemsInfo is empty array', () => {
      const cardData = createCardData(HomeCardType.System);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('There are no Systems')).toBeInTheDocument();
    });

    it('should display "There are no Components" when itemsInfo is empty array', () => {
      const cardData = createCardData(HomeCardType.Component);
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('There are no Components')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error alert when itemsInfo is undefined', () => {
      const cardData = createCardData(HomeCardType.System, {
        itemsInfo: undefined,
      });
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  describe('Items Rendering', () => {
    it('should render items when itemsInfo has data', () => {
      const cardData = createCardData(HomeCardType.System, {
        itemsInfo: [
          {
            name: 'test-system',
            title: 'Test System',
            text: 'Test description',
            namespace: 'default',
            kind: HomeCardType.System,
            tags: ['tag1', 'tag2'],
            star: false,
          },
        ],
      });
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('Test System')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });

    it('should display star icon for starred items', () => {
      const cardData = createCardData(HomeCardType.System, {
        itemsInfo: [
          {
            name: 'test-system',
            title: 'Test System',
            text: 'Test description',
            namespace: 'default',
            kind: HomeCardType.System,
            star: true,
          },
        ],
      });
      renderWithRouter(<HomeCard cardData={cardData} />);
      const starImages = screen.getAllByAltText('logo');
      expect(starImages.length).toBeGreaterThan(1); // icon + star
    });

    it('should render item name when title is not provided', () => {
      const cardData = createCardData(HomeCardType.System, {
        itemsInfo: [
          {
            name: 'test-system-name',
            text: 'Test description',
            namespace: 'default',
            kind: HomeCardType.System,
          },
        ],
      });
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('test-system-name')).toBeInTheDocument();
    });

    it('should render multiple items correctly', () => {
      const cardData = createCardData(HomeCardType.System, {
        itemsInfo: [
          {
            name: 'system-1',
            title: 'System 1',
            text: 'Description 1',
            namespace: 'default',
            kind: HomeCardType.System,
          },
          {
            name: 'system-2',
            title: 'System 2',
            text: 'Description 2',
            namespace: 'default',
            kind: HomeCardType.System,
          },
        ],
      });
      renderWithRouter(<HomeCard cardData={cardData} />);
      expect(screen.getByText('System 1')).toBeInTheDocument();
      expect(screen.getByText('System 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  describe('Card Icon', () => {
    it('should render icon for each card type', () => {
      const cardData = createCardData(HomeCardType.System);
      renderWithRouter(<HomeCard cardData={cardData} />);
      const icons = screen.getAllByAltText('logo');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
