'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import {
	selectCurrentLocale,
	selectCurrentLanguage,
	setLanguage,
	syncLanguageFromCookie,
} from '@/redux/slices/languageSlice'
import type { Locale } from '@/types'

/**
 * Custom hook for language management
 * Automatically syncs language from cookies on mount
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentLocale, currentLanguage, changeLanguage } = useLanguage()
 *
 *   return (
 *     <div>
 *       <p>Current: {currentLanguage.name}</p>
 *       <button onClick={() => changeLanguage('hi')}>Switch to Hindi</button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useLanguage = () => {
	const dispatch = useAppDispatch()
	const currentLocale = useAppSelector(selectCurrentLocale)
	const currentLanguage = useAppSelector(selectCurrentLanguage)

	// Sync from cookies on mount
	useEffect(() => {
		dispatch(syncLanguageFromCookie())
	}, [dispatch])

	const changeLanguage = (locale: Locale) => {
		dispatch(setLanguage(locale))
	}

	return {
		currentLocale,
		currentLanguage,
		changeLanguage,
	}
}

/**
 * Lightweight hook that only provides the change language function
 * Use this when you don't need to read the current language state
 */
export const useChangeLanguage = () => {
	const dispatch = useAppDispatch()

	return (locale: Locale) => {
		dispatch(setLanguage(locale))
	}
}
