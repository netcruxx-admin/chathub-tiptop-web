'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function Home() {
	const router = useRouter()
	const t = useTranslations()

	useEffect(() => {
		router.push('/welcome')
	}, [router])

	return (
		<section className='bg-primary grid place-content-center h-screen'>
			<p className='text-4xl text-white'>{t('common.loading')}</p>
		</section>
	)
}
