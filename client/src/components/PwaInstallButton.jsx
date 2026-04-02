import React, { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { GetApp, IosShare } from '@mui/icons-material'
import { usePwaInstall } from '@/hooks/usePwaInstall'

const btnSx = {
  position: 'fixed',
  bottom: { xs: 'calc(16px + env(safe-area-inset-bottom, 0px))', sm: 20 },
  right: { xs: 14, sm: 18 },
  zIndex: 1400,
  color: 'rgba(226, 232, 240, 0.95)',
  bgcolor: 'rgba(15, 23, 42, 0.75)',
  border: '1px solid rgba(6, 182, 212, 0.35)',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    bgcolor: 'rgba(30, 41, 59, 0.9)',
    borderColor: 'rgba(6, 182, 212, 0.55)',
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    color: 'rgba(148, 163, 184, 0.9)',
  },
}

/**
 * Visible install control when the browser fires `beforeinstallprompt`.
 * iOS Safari has no install API — we show a hint-only control.
 */
export default function PwaInstallButton() {
  const { canPrompt, promptInstall, isStandalone, isIosSafari } = usePwaInstall()
  const [busy, setBusy] = useState(false)

  if (isStandalone) {
    return null
  }

  if (canPrompt) {
    return (
      <Tooltip title="Install app" placement="left">
        <span>
          <IconButton
            size="medium"
            aria-label="Install LearnMeNow app"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              try {
                await promptInstall()
              } finally {
                setBusy(false)
              }
            }}
            sx={btnSx}
          >
            <GetApp />
          </IconButton>
        </span>
      </Tooltip>
    )
  }

  if (isIosSafari) {
    return (
      <Tooltip title="On iPhone/iPad: tap Share → Add to Home Screen" placement="left">
        <span>
          <IconButton size="medium" aria-label="How to install on iOS" sx={btnSx}>
            <IosShare />
          </IconButton>
        </span>
      </Tooltip>
    )
  }

  return null
}
