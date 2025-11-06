/*
 * Copyright (c) 2023-2025. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */
import { CompoundEntityRef } from '@backstage/catalog-model';
import { ChangeEvent, useMemo, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSearch } from '@backstage/plugin-search-react';
import { FormControl } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      formControl: {
        margin: theme.spacing(1, 0),
      },
      label: {
        marginBottom: theme.spacing(1),
        transform: 'initial',
        fontWeight: 'bold',
        fontSize: theme.typography.body2.fontSize,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        '&.Mui-focused': {
          color: theme.palette.text.primary,
        },
      },
    }),
  { name: 'PluginIntegrationTopologySearchableDropdown' },
);

export type SearchableDropDownProps = {
  name: string;
  label?: string;
  rootEntityNames?: CompoundEntityRef[];
  onSelected: (title: string) => void;
  className?: string;
  defaultValue?: string;
  givenValues: string[];
  valuesDebounceMs?: number;
  filterSelectedOptions?: boolean;
  limitTags?: number;
  multiple?: boolean;
};

/**
 * Utility hook for applying a given default value to the search context.
 *
 */
const useDefaultFilterValue = (
  name: string,
  defaultValue?: string | string[] | null,
) => {
  const { setFilters } = useSearch();

  useEffect(() => {
    if (defaultValue && [defaultValue].flat().length > 0) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);
};

const SearchableEntityNameDropDown = (props: SearchableDropDownProps) => {
  const {
    onSelected,
    defaultValue,
    name,
    givenValues,
    multiple = false,
  } = props;
  const { filters, setFilters } = useSearch();
  useDefaultFilterValue(name, defaultValue);

  const filterVal = filters[name] as string | string[] | undefined;

  const filterValue = useMemo(
    () => filterVal || (multiple ? [] : ''),
    [filterVal, multiple],
  );

  // Set new filter values on input change.
  const handleChange = (_: ChangeEvent<{}>, newValue: string | null) => {
    setFilters(prevState => {
      const { [name]: filter, ...others } = prevState;

      if (newValue) {
        return {
          ...others,
          [name]: Array.isArray(newValue) ? newValue.map(v => v) : newValue,
        };
      }
      return { ...others };
    });
  };

  // Provide the input field.
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      name="search"
      variant="outlined"
      fullWidth
      aria-label={`Search ${name}`}
      placeholder={`Select ${name}...`}
    />
  );

  return (
    <Autocomplete
      id={`select-filter-${name}--select`}
      popupIcon={<ExpandMoreIcon data-testid="searchable-dropdown-expand" />}
      filterSelectedOptions
      disableClearable
      limitTags={1}
      multiple={false}
      options={givenValues}
      value={typeof filterValue === 'string' ? filterValue : ''}
      onChange={handleChange}
      onInputChange={(_, newValue) => {
        // Call the onSelected callback with the new value
        if (newValue && typeof newValue === 'string') {
          onSelected(newValue);
        }
      }}
      renderInput={renderInput}
      getOptionSelected={(option, value) => option === value}
      aria-label={`${name} selector`}
    />
  );
};

export const SearchableDropDown = (props: SearchableDropDownProps) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl} fullWidth>
      <div className={classes.label}>{props.label}</div>
      <SearchableEntityNameDropDown {...props} />
    </FormControl>
  );
};
