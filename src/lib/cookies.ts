import Cookies from 'js-cookie'

/**
 * Set a cookie with optional expiration days
 */
export const setCookie = (name: string, value: any, days: number = 7) => {
	const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value
	Cookies.set(name, serializedValue, {
		expires: days,
		path: '/',
		sameSite: 'lax',
	})
}

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): any => {
	const value = Cookies.get(name)
	if (!value) return null

	try {
		// Try to parse as JSON, if it fails return the raw value
		return JSON.parse(value)
	} catch {
		return value
	}
}

/**
 * Remove/erase a cookie by name
 */
export const eraseCookie = (name: string) => {
	Cookies.remove(name, { path: '/' })
}

/**
 * Parse cookies from a context object (for SSR)
 */
export const parseCookies = (ctx?: any): Record<string, string> => {
	if (!ctx?.req?.headers?.cookie) {
		return {}
	}

	const cookies: Record<string, string> = {}
	const cookieString = ctx.req.headers.cookie

	cookieString.split(';').forEach((cookie: string) => {
		const [name, ...rest] = cookie.split('=')
		const value = rest.join('=').trim()
		if (name && value) {
			cookies[name.trim()] = decodeURIComponent(value)
		}
	})

	return cookies
}

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
	return Cookies.get(name) !== undefined
}

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
	return Cookies.get() as Record<string, string>
}
