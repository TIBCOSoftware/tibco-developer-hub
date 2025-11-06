/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

export const CustomTooltip = ({
  title,
  xPos,
  yPos,
}: {
  title: string;
  xPos: number;
  yPos: number;
}) => {
  function calculateWidth(data: string) {
    const length = data.length;
    if (length < 5) {
      return '40';
    } else if (length >= 5 && length <= 15) {
      return '75';
    } else if (length > 15 && length <= 25) {
      return '120';
    } else if (length > 25 && length <= 50) {
      return '175';
    } else if (length > 50 && length < 100) {
      return '200';
    }
    return '250';
  }
  const width = calculateWidth(title);

  return (
    <g x={xPos} y={yPos}>
      <svg
        data-testid="custom-tooltip"
        role="tooltip"
        x={xPos}
        y={yPos}
        width={parseInt(width, 10) >= 75 ? width : '100'}
        height="46"
        viewBox={`0 0 ${parseInt(width, 10) >= 75 ? width : '100'} 46`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          data-testid="tooltip-background"
          x={title.length < 5 ? '8' : '0.5'} // move rectangle so it touches with the tooltip triangle
          y="8"
          width={width}
          height="30"
          rx="4"
          fill="hsla(219, 76%, 23%, 1.00)"
        />
        <svg
          data-testid="tooltip-triangle"
          x={
            title === 'Open Details' ||
            title === 'Lock Details' ||
            title === 'Unlock Details'
              ? '-24px'
              : undefined
          } // move triangle based on icon position
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.3231 8.01758L31.3231 8.01758C32.4441 8.01758 33.3571 6.49091 33.6091 6.17319C33.8611 5.85547 37.7961 0.815881 37.7961 0.815881C38.1831 0.29134 38.7071 0.0175794 39.3221 0.0175795L39.3221 0.0245734L39.3241 0.0245734L39.3241 0.0175795C39.9391 0.0175796 40.4631 0.29134 40.8501 0.815881C40.8501 0.815881 44.7851 5.85547 45.0371 6.17319C45.2891 6.49092 46.2021 8.01758 47.3231 8.01758Z"
            fill="hsla(219, 76%, 23%, 1.00)"
          />
        </svg>
        <text
          x={title.length < 5 ? '20' : '10'} // center text if < 5 chars
          y="25"
          fill="hsla(0, 0%, 100%, 1.00)"
          fontSize="10"
          fontWeight="bold"
        >
          {title}
        </text>
      </svg>
    </g>
  );
};
