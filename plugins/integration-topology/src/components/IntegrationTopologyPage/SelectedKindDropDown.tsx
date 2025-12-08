/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { Select, SelectedItems } from '@backstage/core-components';

export const SelectedKindDropDown = ({
  label,
  selected,
  items,
  onChange,
}: {
  label: string;
  selected: string;
  items: { label: string; value: string }[];
  onChange: (value: string) => void;
}) => {
  function handleChange(e: SelectedItems) {
    onChange(e as string);
  }
  return (
    <Select
      label={label}
      selected={selected}
      items={items}
      onChange={handleChange}
    />
  );
};
