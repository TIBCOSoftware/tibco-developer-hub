/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useState, MouseEvent } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Paper, makeStyles } from '@material-ui/core';
import { CustomIcon } from './CustomIcon';

const useCustomPopOverStyles = makeStyles({
  popover: {
    cursor: 'pointer',
  },
  paper: {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#0E2D65',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
});

export const CustomPopOver = ({
  label,
  popOverContent,
}: {
  label: string;
  popOverContent: string;
}) => {
  const classes = useCustomPopOverStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        style={{ fontSize: '12px', fontWeight: '400' }}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
      >
        {label}{' '}
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        slotProps={{
          paper: {
            onMouseLeave: handlePopoverClose,
            sx: {
              marginTop: '4px',
              overflow: 'visible',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: '50%',
                width: 10,
                height: 10,
                backgroundColor: '#0E2D65',
                transform: 'translate(-50%, -50%) rotate(45deg)',
              },
              '&:after': {
                display: 'none',
              },
            },
          },
        }}
      >
        <Paper className={classes.paper}>
          <Typography>{popOverContent}</Typography>
          <CustomIcon
            id="details-copy-icon"
            iconName="copy"
            iconStyle="detailsTitleIcon"
            onClick={() => {
              navigator.clipboard.writeText(popOverContent);
              handlePopoverClose();
            }}
          />
        </Paper>
      </Popover>
    </div>
  );
};
