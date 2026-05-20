/*
 * Copyright (c) 2023-2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { FieldExtensionComponentProps } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { usePlatformApi } from '../hooks/usePlatformApi';
import type {
  DataplaneWithCapabilities,
  CapabilitySelectorValue,
} from '../types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  helperText: {
    marginTop: theme.spacing(0.5),
    marginLeft: 0,
  },
}));

/**
 * Combined scaffolder field extension that selects a data-plane filtered
 * by required capabilities that are running (green status), and
 * auto-populates deployment details.
 *
 * Registered as `ui:field: SelectDataplaneWithCapabilities` in scaffolder templates.
 *
 * YAML `ui:options`:
 *  - `requiredCapabilities` (string[]) — capability names the data-plane must have running
 *
 * Emits: `{ dataplaneId, dataplaneName, capabilityId, capabilityName, capabilityType, dataplaneUrl, dataplaneHost }`
 */
export const CapabilitySelector = (
  props: FieldExtensionComponentProps<CapabilitySelectorValue>,
) => {
  const { onChange, rawErrors, required, formData, uiSchema } = props;
  const { fetchDataplanesWithCapabilities } = usePlatformApi();
  const classes = useStyles();

  const requiredCapabilities: string[] =
    (uiSchema as Record<string, any>)?.['ui:options']?.requiredCapabilities ??
    [];

  const [dataplanes, setDataplanes] = useState<DataplaneWithCapabilities[]>([]);
  const [selectedDpId, setSelectedDpId] = useState<string>(
    formData?.dataplaneId ?? '',
  );
  const [dataplaneUrl, setDataplaneUrl] = useState<string>(
    formData?.dataplaneUrl ?? '',
  );
  const [dataplaneHost, setDataplaneHost] = useState<string>(
    formData?.dataplaneHost ?? '',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const emitValue = useCallback(
    (dp: DataplaneWithCapabilities, url: string, host: string) => {
      onChangeRef.current({
        dataplaneId: dp.id,
        dataplaneName: dp.name,
        capabilityId: dp.deployment.capabilityId,
        capabilityName: dp.deployment.capabilityName,
        capabilityType: dp.deployment.capabilityType,
        dataplaneUrl: url,
        dataplaneHost: host,
      });
    },
    [],
  );

  useEffect(() => {
    if (requiredCapabilities.length === 0) {
      setLoading(false);
      setError('No required capabilities specified in template configuration.');
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchDataplanesWithCapabilities(
          requiredCapabilities,
        );
        if (cancelled) return;

        const list = data?.dataplanes ?? [];
        if (list.length === 0) {
          setError(
            `No data-planes with the required capabilities (${requiredCapabilities.join(
              ', ',
            )}) are available.`,
          );
          setLoading(false);
          return;
        }

        setDataplanes(list);

        // Auto-select first if no prior selection
        if (!formData?.dataplaneId && list[0]) {
          const first = list[0];
          setSelectedDpId(first.id);
          setDataplaneUrl(first.deployment.dataplaneUrl);
          setDataplaneHost(first.deployment.dataplaneHost);
          emitValue(
            first,
            first.deployment.dataplaneUrl,
            first.deployment.dataplaneHost,
          );
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
  }, [fetchDataplanesWithCapabilities]);

  const handleDpChange = (dpId: string) => {
    const dp = dataplanes.find(d => d.id === dpId);
    if (!dp) return;
    setSelectedDpId(dp.id);
    const url = dp.deployment.dataplaneUrl;
    const host = dp.deployment.dataplaneHost;
    setDataplaneUrl(url);
    setDataplaneHost(host);
    emitValue(dp, url, host);
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (error) {
    return <FormHelperText error>{error}</FormHelperText>;
  }

  const selectedDp = dataplanes.find(d => d.id === selectedDpId);
  const hasErrors = rawErrors && rawErrors.length > 0;

  return (
    <FormControl
      margin="normal"
      required={required}
      error={hasErrors && !formData}
      fullWidth
    >
      <div className={classes.root}>
        <div>
          <InputLabel id="select-dp-cap-label">
            Select Dataplane (filtered by capabilities)
          </InputLabel>
          <Select
            labelId="select-dp-cap-label"
            id="select-dp-cap"
            value={selectedDpId}
            onChange={e => handleDpChange(e.target.value as string)}
            label="Select Dataplane (filtered by capabilities)"
            fullWidth
          >
            {dataplanes.map(dp => (
              <MenuItem key={dp.id} value={dp.id}>
                {dp.name}
              </MenuItem>
            ))}
          </Select>
          {selectedDp && (
            <FormHelperText>
              {`Selected Dataplane: ${
                selectedDp.id
              } | filtered by capabilities : ${requiredCapabilities.join(
                ', ',
              )}`}
            </FormHelperText>
          )}
        </div>
        <br />

        <TextField
          label="Dataplane Capability URL"
          helperText="Base URL for the capability provisioner on the data-plane. Edit if auto-detected value is incorrect."
          value={dataplaneUrl}
          onChange={e => {
            const val = e.target.value;
            setDataplaneUrl(val);
            if (selectedDp) {
              emitValue(selectedDp, val, dataplaneHost);
            }
          }}
          fullWidth
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: true }}
          FormHelperTextProps={{ className: classes.helperText }}
        />
        <br />
        <TextField
          label="Dataplane Hostname"
          helperText="Hostname for the data-plane. Edit if auto-detected value is incorrect."
          value={dataplaneHost}
          onChange={e => {
            const val = e.target.value;
            setDataplaneHost(val);
            if (selectedDp) {
              emitValue(selectedDp, dataplaneUrl, val);
            }
          }}
          fullWidth
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: true }}
          FormHelperTextProps={{ className: classes.helperText }}
        />
      </div>
    </FormControl>
  );
};
