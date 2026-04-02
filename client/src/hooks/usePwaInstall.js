import { useCallback, useEffect, useState } from 'react'

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches === true ||
    window.matchMedia?.('(display-mode: fullscreen)')?.matches === true ||
    window.navigator?.standalone === true
  )
}

function isIosSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const webkit = /WebKit/.test(ua)
  const notChrome = !/CriOS|FxiOS|EdgiOS|OPiOS|Brave/.test(ua)
  return iOS && webkit && notChrome
}

/**
 * Captures `beforeinstallprompt` so the app can show its own Install control.
 * Browsers often hide or omit the address-bar install icon; this does not replace
 * those heuristics but gives users a clear action when the event fires.
 */
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [standalone, setStandalone] = useState(isStandaloneDisplay)

  useEffect(() => {
    setStandalone(isStandaloneDisplay())
  }, [])

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const onInstalled = () => {
      setDeferredPrompt(null)
      setStandalone(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    const ev = deferredPrompt
    if (!ev || typeof ev.prompt !== 'function') {
      return { outcome: 'unavailable' }
    }
    await ev.prompt()
    const result = await ev.userChoice
    setDeferredPrompt(null)
    return { outcome: result?.outcome === 'accepted' ? 'accepted' : 'dismissed' }
  }, [deferredPrompt])

  return {
    /** True when the browser offered install and we can call `promptInstall`. */
    canPrompt: Boolean(deferredPrompt) && !standalone,
    promptInstall,
    isStandalone: standalone,
    isIosSafari: isIosSafari(),
  }
}
