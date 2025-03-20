export function parseJson<T = any>(stringValue?: string) {
  if (!stringValue) {
    return
  }
  
  try {
    const commentObject = JSON.parse(stringValue)

    if (typeof commentObject === 'object') {
      return commentObject as T
    }

    return
  } catch {
    return
  }
}