'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import BackBtn from '@/components/backBtn'

export default function ConfirmLanguage() {
	const router = useRouter()
	const [language, setLanguage] = useState('english')

	const languages = [
		{ code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish' },
		{ code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
		{ code: 'english', name: 'English', nativeName: 'English' },
	]
	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div className='w-full flex flex-col'>
				<div className='mb-6'>
					<BackBtn />
				</div>
				<div className='text-center space-y-2 mb-6'>
					<h1 className='text-2xl font-bold'>Confirm your language</h1>
					<p className='text-muted-foreground'>
						{language === 'hinglish' && 'Apni language confirm karein'}
						{language === 'hindi' && 'अपनी भाषा की पुष्टि करें'}
						{language === 'english' && 'Confirm your language'}
					</p>
				</div>

				<div className='space-y-3 mb-6'>
					{languages.map(lang => (
						<button
							key={lang.code}
							onClick={() => setLanguage(lang.code)}
							className={cn(
								'w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between',
								language === lang.code
									? 'border-primary bg-primary/5'
									: 'border-border hover:border-primary/50 hover:bg-muted/50'
							)}
						>
							<div className='text-left'>
								<div className='font-semibold'>{lang.nativeName}</div>
								<div className='text-sm text-muted-foreground'>{lang.name}</div>
							</div>
							{language === lang.code && (
								<Check className='w-5 h-5 text-primary' />
							)}
						</button>
					))}
				</div>

				<Button
					className='w-full h-12 text-base font-semibold'
					onClick={() => {
						router.push('/onboarding')
					}}
				>
					Continue
				</Button>
			</div>
		</div>
	)
}
