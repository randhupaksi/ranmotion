import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// A route may finish loading after the navigation effect. Wait for its actual content,
// including a lazily loaded challenge, before moving the viewport and keyboard focus.
export default function RouteExperience() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return
    let anchor = ''
    try {
      anchor = decodeURIComponent(hash.slice(1))
    } catch {
      anchor = hash.slice(1)
    }
    let settled = false
    const position = () => {
      if (settled || main.querySelector('[data-route-loading]')) return
      const target = anchor ? document.getElementById(anchor) : main
      if (!target) return
      settled = true
      observer.disconnect()
      if (anchor) {
        let parent = target.parentElement
        while (parent && parent !== main) {
          if (parent instanceof HTMLDetailsElement) parent.open = true
          parent = parent.parentElement
        }
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.scrollIntoView({ block: 'start', behavior: 'instant' })
      } else window.scrollTo({ top: 0, behavior: 'instant' })
      target.focus({ preventScroll: true })
    }
    const observer = new MutationObserver(position)
    observer.observe(main, { childList: true, subtree: true })
    position()
    const deadline = window.setTimeout(() => observer.disconnect(), 10000)
    return () => {
      observer.disconnect()
      clearTimeout(deadline)
    }
  }, [pathname, hash])
  useEffect(() => {
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => {
      history.scrollRestoration = previous
    }
  }, [])
  return null
}
