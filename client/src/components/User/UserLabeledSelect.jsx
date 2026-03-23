import React from 'react'
import { FormControl, MenuItem, Select, Typography } from '@mui/material'
import {
  userDarkSelectMenuProps,
  userDarkSelectReadableDisabledSx,
  userDarkSelectSx,
  userPlaceholderMenuEmSx,
  userSelectFieldLabelSx,
  userSelectPlaceholderSx,
  userSelectValueSx,
} from './userAuthShell.theme'

const defaultFormat = (s) => String(s || '').toUpperCase()

/**
 * Label + dark `Select` used on user flows (competition, planning).
 * @param {object} props
 * @param {string} props.label — visible label above the field
 * @param {string} props.selectId — `id` / `htmlFor` target
 * @param {string} props.value
 * @param {(event: object) => void} props.onChange — MUI `Select` `onChange`
 * @param {{ value: string, label: string }[]} props.options — non-empty list items (a “None” row is added)
 * @param {string} props.placeholder — when value is empty
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.readableWhenDisabled] — use readable slate text when disabled
 * @param {string} [props.noneLabel='None']
 * @param {(label: string) => string} [props.formatOptionLabel]
 * @param {object} [props.labelSx] — merged onto the label `Typography` `sx`
 */
const UserLabeledSelect = ({
  label,
  selectId,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  readableWhenDisabled = false,
  noneLabel = 'None',
  formatOptionLabel = defaultFormat,
  labelSx = {},
}) => {
  const labelId = `${selectId}-field-label`
  const selectSx = readableWhenDisabled
    ? { ...userDarkSelectReadableDisabledSx, mt: 0.75 }
    : { ...userDarkSelectSx, mt: 0.75 }

  return (
    <FormControl fullWidth size="small" className="user-labeled-select">
      <Typography component="label" id={labelId} htmlFor={selectId} variant="body2" sx={{ ...userSelectFieldLabelSx, ...labelSx }}>
        {label}
      </Typography>
      <Select
        id={selectId}
        value={value}
        onChange={onChange}
        displayEmpty
        disabled={disabled}
        inputProps={{ 'aria-labelledby': labelId }}
        renderValue={(v) => {
          if (v === '' || v == null) {
            return (
              <Typography component="span" sx={userSelectPlaceholderSx}>
                {placeholder}
              </Typography>
            )
          }
          const opt = options.find((o) => o.value === String(v))
          const text = opt?.label ?? 'Untitled'
          return (
            <Typography component="span" sx={userSelectValueSx}>
              {formatOptionLabel(text)}
            </Typography>
          )
        }}
        sx={selectSx}
        MenuProps={userDarkSelectMenuProps}
      >
        <MenuItem value="">
          <Typography component="span" sx={{ ...userPlaceholderMenuEmSx, fontSize: '0.875rem' }}>
            {noneLabel}
          </Typography>
        </MenuItem>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {formatOptionLabel(o.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default UserLabeledSelect
