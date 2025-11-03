import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import type { RootState } from '../store'
import type { Locale, Language } from '@/types'
import { languages } from '@/lib/utils/languages'

interface LanguageStore {
	currentLocale: Locale
}

// Helper function to get locale from cookies or default
const getLocaleFromCookie = (): Locale => {
	if (typeof window !== 'undefined') {
		const cookieLocale = Cookies.get('locale') as Locale | undefined
		return cookieLocale || 'en'
	}
	return 'en'
}

// Helper function to set locale in cookies
const setLocaleCookie = (locale: Locale): void => {
	Cookies.set('locale', locale, {
		expires: 365, // 1 year
		path: '/',
		sameSite: 'lax',
	})
}

// Initial state always defaults to 'en', will be synced from cookies on initialization
const initialState: LanguageStore = {
	currentLocale: getLocaleFromCookie(),
}

const languageSlice = createSlice({
	name: 'language',
	initialState,
	reducers: {
		setLanguage: (state, action: PayloadAction<Locale>) => {
			state.currentLocale = action.payload
			setLocaleCookie(action.payload)
		},
		syncLanguageFromCookie: state => {
			// Sync Redux state from cookie (call this on app initialization)
			const cookieLocale = getLocaleFromCookie()
			state.currentLocale = cookieLocale
		},
	},
})

export const { setLanguage, syncLanguageFromCookie } = languageSlice.actions

// Selectors
export const selectCurrentLocale = (state: RootState): Locale =>
	state.language.currentLocale

export const selectCurrentLanguage = (state: RootState): Language => {
	const locale = state.language.currentLocale
	return languages.find(lang => lang.code === locale) || languages[1] // Default to English
}

export const selectAllLanguages = (): Language[] => languages

export const selectLanguageByCode = (code: Locale): Language | undefined =>
	languages.find(lang => lang.code === code)

export default languageSlice.reducer
