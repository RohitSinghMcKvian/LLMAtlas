import { useState, useEffect, useCallback } from 'react'

export function useSimpleMode() {
  const [isSimpleMode, setIsSimpleMode] = useState(() => {
    const stored = localStorage.getItem('llmatlas-mode')
    return stored === 'simple'
  })

  useEffect(() => {
    localStorage.setItem('llmatlas-mode', isSimpleMode ? 'simple' : 'expert')
  }, [isSimpleMode])

  const toggleMode = useCallback(() => {
    setIsSimpleMode((prev) => !prev)
  }, [])

  return { isSimpleMode, toggleMode, setIsSimpleMode }
}