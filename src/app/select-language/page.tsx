'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { languages } from '@/lib/utils/languages'
import { useGetLocale, useSetLocale } from '@/lib/hooks/i18n'
import { useTranslations } from 'next-intl'

export default function LanguageSelection() {
	const locale = useGetLocale()
	const setLocale = useSetLocale()
	const [language, setLanguage] = useState(locale)
	const t = useTranslations()

	const changeLanguage = (newLang: string) => {
		setLanguage(newLang)
		setLocale(newLang)
		// Use window.location to force a full page reload with new locale
		window.location.href = '/welcome'
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b'>
				<h1 className='text-lg font-semibold text-center'>{t('settings.language')}</h1>
			</div>

			<div className='flex-1 p-6'>
				<div className='grid grid-cols-3 gap-3 max-w-2xl mx-auto'>
					{languages.map(lang => (
						<Button
							key={lang.code}
							variant={language === lang.code ? 'default' : 'outline'}
							onClick={() => changeLanguage(lang.code)}
							className='h-auto py-4 px-3 flex flex-col items-center justify-center text-center cursor-pointer'
						>
							<span className='text-base font-semibold mb-1'>{lang.name}</span>
						</Button>
					))}
				</div>
			</div>
		</div>
	)
}
