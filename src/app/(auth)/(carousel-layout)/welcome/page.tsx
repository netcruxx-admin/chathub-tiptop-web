'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function WelcomePage() {
	const t = useTranslations()
	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div className='w-full flex flex-col items-center text-center'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold mb-2'>{t('splash.subtitle')}</h1>
					<p className='text-muted-foreground'>{t('userType.workerDesc')}</p>
				</div>
				<div className='flex flex-col sm:flex-row gap-4 mb-12 w-full justify-center items-center'>
					<Link href='/signup-phone'>
						<Button className='h-12 px-8 text-base bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl shadow-lg'>
							{t('userType.worker')}
						</Button>
					</Link>
					<Link href='/login'>
						<Button
							variant='outline'
							className='h-12 px-8 text-base border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 font-semibold rounded-xl'
						>
							{t('userType.employer')}
						</Button>
					</Link>
				</div>
				<div className='mt-8 text-center'>
					<div className='flex items-center gap-2.5 text-xs text-muted-foreground'>
						<Image
							src='/make-in-india-logo.jpg'
							alt={t('common.makeInIndia')}
							width={20}
							height={20}
							className='rounded-sm'
							// style={{ objectFit: "cover" }}
						/>
						<span>{t('common.makeInIndia')}</span>
						<span>•</span>
						<Shield className='size-3' />
						<a
							href='https://ahalts.com'
							target='_blank'
							rel='noopener noreferrer'
							className='hover:text-primary transition-colors'
						>
							{t('common.ahalts')}
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
