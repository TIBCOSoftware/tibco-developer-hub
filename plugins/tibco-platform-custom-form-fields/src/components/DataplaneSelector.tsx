/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { useEffect, useRef, useState } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { usePlatformApi } from '../hooks/usePlatformApi';
import type { DataplaneSummary } from '../types';

/**
 * Scaffolder field extension that lets users pick a TIBCO data-plane.
 * Registered as `ui:field: DataplaneSelector` in scaffolder templates.
 * Fetches available data-planes from the platform API and emits the
 * selected data-plane as `{ id: string; name: string }`.
 */
export const DataplaneSelector = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<DataplaneSummary>) => {
  const { fetchDataplanes } = usePlatformApi();

  const [dataplanes, setDataplanes] = useState<DataplaneSummary[]>([]);
  const [selectedDataplane, setSelectedDataplane] = useState<
    DataplaneSummary | undefined
  >(formData?.id ? formData : undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guard against calling onChange after unmount.
  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  // Stable ref for onChange to avoid re-triggering the effect.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchDataplanes();
        if (cancelled) return;

        const list = data?.response ?? [];
        if (list.length === 0) {
          setError(
            'No data-planes are available. Please register a data-plane in the TIBCO Control Plane first.',
          );
          setLoading(false);
          return;
        }

        setDataplanes(list);

        if (!formData?.id && list[0]) {
          const first = { id: list[0].id, name: list[0].name };
          setSelectedDataplane(first);
          onChangeRef.current(first);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load data-planes.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataplanes]);

  const handleChange = (dpId: string) => {
    const dp = dataplanes.find(d => d.id === dpId);
    if (!dp) return;
    const value = { id: dp.id, name: dp.name };
    setSelectedDataplane(value);
    onChange(value);
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (error) {
    return <FormHelperText error>{error}</FormHelperText>;
  }

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors && rawErrors.length > 0 && !formData}
      fullWidth
    >
      <InputLabel id="select-dp-label">Dataplane</InputLabel>
      <Select
        labelId="select-dp-label"
        id="select-dp"
        value={selectedDataplane?.id ?? ''}
        onChange={e => handleChange(e.target.value as string)}
        label="Dataplane"
      >
        {dataplanes.map(dp => (
          <MenuItem key={dp.id} value={dp.id}>
            {dp.name}
          </MenuItem>
        ))}
      </Select>
      {selectedDataplane && (
        <FormHelperText>
          {`Selected DataplaneId: ${selectedDataplane.id}`}
        </FormHelperText>
      )}
    </FormControl>
  );
};
