/** Shared MUI `sx` for user-facing auth-style pages (slate + cyan). */

export const userShellOuterSx = {
  minHeight: '100dvh',
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #1e293b 100%)',
  overflow: 'auto',
}

/** Full-bleed content (e.g. wide forms). */
export const userShellInnerFullSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  width: '100%',
  minHeight: '100dvh',
  boxSizing: 'border-box',
  p: { xs: 2, sm: 3 },
}

/** Default: full-viewport background, small content centered. */
export const userShellInnerCenteredSx = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '100dvh',
  boxSizing: 'border-box',
  p: { xs: 2, sm: 3 },
}

export const userShellPaperSx = (alignItems = 'center') => ({
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems,
  width: '100%',
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(71, 85, 105, 0.3)',
  borderRadius: 3,
  backdropFilter: 'blur(10px)',
})

export const userBrandIconWrapperSx = {
  width: 40,
  height: 40,
  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mr: 1,
}

export const userShellTitleSx = {
  fontWeight: 700,
  color: 'white',
  mb: 0.5,
  fontSize: { xs: '1.35rem', sm: '1.5rem' },
}

export const userShellSubtitleSx = {
  color: 'rgba(148, 163, 184, 0.9)',
  mb: 2,
}

/** Select on dark paper — force light text on the closed value (MUI often defaults to near-black). */
export const userDarkSelectSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    color: '#f1f5f9',
    '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.55)' },
    '&:hover fieldset': { borderColor: 'rgba(100, 116, 139, 0.85)' },
    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
  },
  '& .MuiSelect-select': {
    color: '#f1f5f9',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(203, 213, 225, 0.92)',
  },
  '& .MuiSvgIcon-root': { color: 'rgba(203, 213, 225, 0.92)' },
}

/**
 * Dark select + overrides so `disabled` state keeps readable slate placeholder text
 * (default MUI disabled styling is too dark on `userDarkSelectSx` fields).
 */
export const userDarkSelectReadableDisabledSx = {
  ...userDarkSelectSx,
  '&.Mui-disabled .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    opacity: 1,
  },
  '&.Mui-disabled .MuiSelect-select': {
    WebkitTextFillColor: 'rgba(203, 213, 225, 0.75)',
    color: 'rgba(203, 213, 225, 0.75)',
  },
  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(71, 85, 105, 0.45)',
  },
  '&.Mui-disabled .MuiSelect-icon': {
    color: 'rgba(148, 163, 184, 0.45)',
  },
}

export const userDarkSelectLabelSx = {
  color: 'rgba(148, 163, 184, 0.8)',
  '&.Mui-focused': { color: '#06b6d4' },
}

export const userDarkSelectMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: 'rgba(15, 23, 42, 0.98)',
      border: '1px solid rgba(71, 85, 105, 0.4)',
      '& .MuiMenuItem-root': { color: 'rgba(226, 232, 240, 0.95)' },
      '& .MuiMenuItem-root:hover': { bgcolor: 'rgba(6, 182, 212, 0.12)' },
      '& .MuiMenuItem-root.Mui-selected': { bgcolor: 'rgba(6, 182, 212, 0.2)' },
    },
  },
}

/** Matches UserLogin primary “Sign in” — slate surface + dark text (not cyan fill). */
export const userPrimaryCtaButtonSx = {
  fontWeight: 600,
  textTransform: 'none',
  backgroundColor: 'rgba(148, 163, 184, 0.92)',
  color: '#0f172a',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'rgba(226, 232, 240, 0.98)',
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: 'rgba(51, 65, 85, 0.55)',
    color: 'rgba(148, 163, 184, 0.5)',
  },
}

export const userTextNavLinkSx = {
  mt: 2,
  textTransform: 'none',
  fontWeight: 500,
  color: 'rgba(226, 232, 240, 0.88)',
  '&:hover': { color: '#e2e8f0', backgroundColor: 'rgba(148, 163, 184, 0.08)' },
}

export const userDetailPanelSx = {
  mt: 1,
  p: 2,
  borderRadius: 2,
  bgcolor: 'rgba(30, 41, 59, 0.6)',
  border: '1px solid rgba(71, 85, 105, 0.35)',
}

export const userDetailKickerSx = {
  color: '#06b6d4',
  fontWeight: 600,
  mb: 0.5,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontSize: '0.7rem',
}

export const userDetailHeadingSx = { color: 'white', fontWeight: 600, mb: 1 }

export const userDetailBodySx = { color: 'rgba(203, 213, 225, 0.95)', lineHeight: 1.6 }

export const userMutedHintSx = { color: 'rgba(148, 163, 184, 0.8)' }

export const userEmptyStateTextSx = { color: 'rgba(148, 163, 184, 0.85)' }

export const userPlaceholderMenuEmSx = { color: 'rgba(148, 163, 184, 0.9)' }

/** External label above Select (avoids MUI floating label + `renderValue` overlap). */
export const userSelectFieldLabelSx = {
  display: 'block',
  color: 'rgba(226, 232, 240, 0.9)',
  fontWeight: 600,
}

export const userSelectPlaceholderSx = {
  color: 'rgba(203, 213, 225, 0.72)',
  fontSize: '0.9375rem',
}

/** Closed Select when a value is chosen — same as field text. */
export const userSelectValueSx = {
  color: '#f1f5f9',
  fontSize: '0.9375rem',
  fontWeight: 500,
}

export const userSpinnerCenterSx = {
  display: 'flex',
  justifyContent: 'center',
  py: 6,
}

export const userAccentSpinnerSx = { color: '#06b6d4' }
