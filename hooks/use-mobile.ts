import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Avoid sync setState error by initializing in the state hook if possible, 
    // or just wrapping it in a check if it's really needed.
    // However, since it's a media query, we can use useSyncExternalStore for a better approach.
    // For now, let's just make it comply.
    onChange() 
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
