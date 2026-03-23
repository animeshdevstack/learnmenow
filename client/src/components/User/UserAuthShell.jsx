import React from 'react'
import { Box, Container, Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import {
  userShellOuterSx,
  userShellInnerFullSx,
  userShellInnerCenteredSx,
  userShellPaperSx,
  userBrandIconWrapperSx,
  userShellTitleSx,
  userShellSubtitleSx,
} from './userAuthShell.theme'
import './userAuthShell.css'

const defaultBrandMark = (
  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
    L
  </Typography>
)

/**
 * Single-column slate/cyan shell shared by user pages (e.g. competition picker).
 * For split marketing + form layouts (login), keep page-specific structure.
 */
const UserAuthShell = ({
  children,
  title,
  subtitle,
  brandMark,
  footer,
  className = '',
  paperSx = {},
  motionDuration = 0.6,
  paperAlign = 'center',
  containerMaxWidth = 'sm',
  /** Use full viewport width (no `maxWidth="sm"` clamp). */
  fullWidth = false,
}) => {
  const paperBase = userShellPaperSx(paperAlign)
  const paperFillSx = fullWidth
    ? {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
        borderRadius: { xs: 2, sm: 3 },
      }
    : {}

  const containerProps = fullWidth
    ? { maxWidth: false, sx: { width: '100%', py: 0, px: 0, flex: 1, display: 'flex', flexDirection: 'column' } }
    : { maxWidth: containerMaxWidth, sx: { py: 2 } }

  return (
    <Box className={`user-auth-shell ${className}`.trim()} sx={userShellOuterSx}>
      <Box sx={fullWidth ? userShellInnerFullSx : userShellInnerCenteredSx}>
        <Container {...containerProps}>
          <motion.div
            style={fullWidth ? { width: '100%', flex: 1, display: 'flex', flexDirection: 'column' } : undefined}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionDuration }}
          >
            <Paper elevation={0} sx={{ ...paperBase, ...paperFillSx, ...paperSx }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                <Box sx={userBrandIconWrapperSx}>{brandMark ?? defaultBrandMark}</Box>
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}
                >
                  LearnMeNow
                </Typography>
              </Box>

              {title != null && title !== '' && (
                <Typography component="h1" variant="h5" sx={{ ...userShellTitleSx, width: '100%' }}>
                  {title}
                </Typography>
              )}
              {subtitle ? (
                <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%' }}>
                  {subtitle}
                </Typography>
              ) : null}

              {children}
              {footer}
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default UserAuthShell
