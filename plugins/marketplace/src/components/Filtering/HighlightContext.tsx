/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import React, { createContext, useState } from 'react';

// Creating a context for the text to be highlighted
const HighlightContext = createContext<{
  highlight: string;
  setHighlight: React.Dispatch<React.SetStateAction<string>>;
}>({ highlight: '', setHighlight: () => {} });

// Creating the highlight provider
const HighlightProvider = ({ children }: { children: any }) => {
  const [highlight, setHighlight] = useState('');

  return (
    <HighlightContext.Provider value={{ highlight, setHighlight }}>
      {children}
    </HighlightContext.Provider>
  );
};

export { HighlightContext, HighlightProvider };
