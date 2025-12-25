/**
 * UUID generation utility with Android WebView compatibility
 *
 * crypto.randomUUID() is not supported in older Android WebViews.
 * This utility provides a fallback implementation.
 */

/**
 * Generate a RFC4122 version 4 UUID
 * Falls back to custom implementation if crypto.randomUUID is not available
 */
export function generateUUID(): string {
  // Try native crypto.randomUUID first (fastest)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (error) {
      console.warn('[UUID] crypto.randomUUID failed, using fallback:', error);
    }
  }

  // Fallback for Android WebView and older browsers
  // Generate RFC4122 version 4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
