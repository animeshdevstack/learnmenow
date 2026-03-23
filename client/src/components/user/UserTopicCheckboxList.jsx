import React from 'react'
import { Box, Checkbox, Typography } from '@mui/material'

/**
 * Scrollable list of topic rows with aligned checkbox + label.
 * @param {object} props
 * @param {string} props.className — optional on `ul`
 * @param {unknown[]} props.items
 * @param {(row: unknown) => string} props.getId
 * @param {(row: unknown) => string} props.getLabel
 * @param {Set<string> | string[]} props.selectedIds
 * @param {(id: string) => void} props.onToggle
 */
const UserTopicCheckboxList = ({ className = '', items, getId, getLabel, selectedIds, onToggle }) => {
  const has = (id) => {
    const s = String(id)
    if (selectedIds instanceof Set) return selectedIds.has(s)
    return selectedIds.includes(s)
  }

  return (
    <Box component="ul" className={`planning-topic-list ${className}`.trim()}>
      {items.map((row) => {
        const id = getId(row)
        if (!id) return null
        const checked = has(id)
        const inputId = `topic-cb-${id}`
        return (
          <Box key={id} component="li" className="planning-topic-row">
            <Checkbox
              id={inputId}
              size="small"
              checked={checked}
              onChange={() => onToggle(id)}
              inputProps={{ 'aria-labelledby': `${inputId}-text` }}
              className="planning-topic-checkbox"
            />
            <Typography
              id={`${inputId}-text`}
              component="label"
              htmlFor={inputId}
              variant="body2"
              className="planning-topic-label"
            >
              {getLabel(row) || 'Untitled'}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

export default UserTopicCheckboxList
