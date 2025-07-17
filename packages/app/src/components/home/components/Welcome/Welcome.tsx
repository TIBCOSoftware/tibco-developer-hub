/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React from 'react';
import './Welcome.css';
import { WelcomeData } from '../../types';

export const Welcome = (props: WelcomeData) => {
  return (
    <div>
      <div className="tpdh-welcome-title">
        Welcome to the {props.title}, {props.name}
      </div>
      <div className="tpdh-welcome-desc">
        TIBCO® Developer Hub is the center for building the apps for empowering
        your organization
      </div>
    </div>
  );
};
