/** Shared helpers for MUI selects (competition, subject, chapter lists). */

export const entityId = (row) =>
  row?._id != null ? String(row._id) : row?.id != null ? String(row.id) : ''

export const toSelectOptions = (rows, nameKey = 'Name') =>
  (rows || [])
    .map((row) => {
      const value = entityId(row)
      if (!value) return null
      return { value, label: row[nameKey] || 'Untitled' }
    })
    .filter(Boolean)
