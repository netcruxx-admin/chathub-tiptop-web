'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useGetLocale, useSetLocale } from '@/lib/hooks/i18n'
import { languages } from '@/lib/utils/languages'
import { useTranslations } from 'next-intl'

export default function ConfirmLanguage() {
	const router = useRouter()
	const t = useTranslations()
	const currentLocale = useGetLocale()
	const setLocale = useSetLocale()
	const [language, setLanguage] = useState(currentLocale || 'en')

	// Prefetch the next page to reduce loading time
	useEffect(() => {
		router.prefetch('/signup-onboarding')
	}, [router])
	
	const handleContinue = () => {
		// Save the selected language to cookie
		setLocale(language)
		// Use window.location to force a full page reload with new locale
		window.location.href = '/signup-onboarding'
	}

	return (
		<div className='min-h-screen bg-background flex flex-col justify-center items-center p-8'>
			<div className='w-full max-w-md flex flex-col'>
				<div className='text-center space-y-2 mb-8'>
					<h1 className='text-2xl font-bold'>{t('signupLanguage.title')}</h1>
					<p className='text-muted-foreground'>
						{language === 'hi-Latn' && 'Apni language confirm karein'}
						{language === 'hi' && 'अपनी भाषा की पुष्टि करें'}
						{language === 'en' && 'Confirm your language'}
					</p>
				</div>

				<div className='space-y-3 mb-6'>
					{languages.map(lang => (
						<button
							key={lang.code}
							onClick={() => setLanguage(lang.code)}
							className={cn(
								'w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between cursor-pointer',
								language === lang.code
									? 'border-primary bg-primary/5'
									: 'border-border hover:border-primary/50 hover:bg-muted/50'
							)}
						>
							<div className='text-left'>
								<div className='font-semibold'>{lang.name}</div>
								<div className='text-sm text-muted-foreground'>{lang.displayCode}</div>
							</div>
							{language === lang.code && (
								<Check className='w-5 h-5 text-primary' />
							)}
						</button>
					))}
				</div>

				<Button
					className='w-full h-12 text-base font-semibold cursor-pointer'
					onClick={handleContinue}
				>
					{t('common.continue')}
				</Button>
			</div>
		</div>
	)
}
