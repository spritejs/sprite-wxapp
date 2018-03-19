export function requestAnimationFrame(fn) {
  const now = Date.now()
  return setTimeout(() => {
    fn(now)
  }, 16)
}

export function cancelAnimationFrame(id) {
  return clearTimeout(id)
}

