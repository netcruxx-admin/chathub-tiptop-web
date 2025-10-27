// Translation & Internationalization Types

export type TranslationFunction = (key: string) => string

export type Locale = 'en' | 'hi' | 'hi-Latn'

export interface Language {
	code: Locale
	name: string
	displayCode: string
}

export interface UserSettings {
	locale: Locale
	notifications: boolean
	theme: 'light' | 'dark' | 'system'
}
