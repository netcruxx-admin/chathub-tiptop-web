'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { languages } from '@/lib/utils/languages'
import { useRouter } from 'next/navigation'
import { useGetLocale, useSetLocale } from '@/lib/hooks/i18n'

export default function LanguageSelection() {
	const router = useRouter()
	const locale = useGetLocale()
	const setLocale = useSetLocale()
	const [language, setLanguage] = useState(locale)

	const changeLanguage = newLang => {
		setLanguage(newLang)
		setLocale(newLang)
		router.back()
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					className='mr-2'
					onClick={() => router.back()}
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<h1 className='text-lg font-semibold'>Bolne ki Bhasha Chuniye</h1>
			</div>

			<div className='flex-1 p-6'>
				<div className='grid grid-cols-3 gap-3 max-w-2xl mx-auto'>
					{languages.map(lang => (
						<Button
							key={lang.code}
							variant={language === lang.code ? 'default' : 'outline'}
							onClick={() => changeLanguage(lang.code)}
							className='h-auto py-4 px-3 flex flex-col items-center justify-center text-center'
						>
							<span className='text-base font-semibold mb-1'>{lang.name}</span>
						</Button>
					))}
				</div>
			</div>
		</div>
	)
}
