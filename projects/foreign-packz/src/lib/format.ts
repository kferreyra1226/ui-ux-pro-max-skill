/** Money is stored in cents everywhere. Never do arithmetic on the formatted string. */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso));
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Joins class names, dropping falsy values. */
export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Compares a pathname to a route, ignoring a trailing slash.
 * The static preview build emits directory-style URLs ("/admin/login/"), so an exact
 * string comparison against "/admin/login" would silently fail.
 */
export function isRoute(pathname: string, route: string): boolean {
  const strip = (v: string) => (v.length > 1 ? v.replace(/\/+$/, '') : v);
  return strip(pathname) === strip(route);
}
