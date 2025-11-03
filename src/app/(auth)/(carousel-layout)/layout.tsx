'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { CarouselImage } from '@/types'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const carouselImagesSrcs: CarouselImage[] = [
	{
		src: '/delivery-food.jpg',
		alt: 'Food delivery worker on bike',
		statKey: 'activeJobSeekers',
		descKey: 'activeJobSeekersDesc',
	},
	{
		src: '/construction.jpg',
		alt: 'Construction workers at site',
		statKey: 'jobsPosted',
		descKey: 'jobsPostedDesc',
	},
	{
		src: '/woman-cooking.jpg',
		alt: 'Woman cook preparing food',
		statKey: 'trustedEmployers',
		descKey: 'trustedEmployersDesc',
	},
	{
		src: '/warehouse-boxes.jpg',
		alt: 'Warehouse worker handling packages',
		statKey: 'interviewRate',
		descKey: 'interviewRateDesc',
	},
	{
		src: '/electrician.jpg',
		alt: 'Electrician at work',
		statKey: 'salaryRange',
		descKey: 'salaryRangeDesc',
	},
	{
		src: '/woman-housekeeping.jpg',
		alt: 'Woman housekeeping worker',
		statKey: 'support',
		descKey: 'supportDesc',
	},
]

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const t = useTranslations()

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex(prev => (prev + 1) % carouselImagesSrcs.length)
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	return (
		<div className='min-h-screen bg-gradient-to-br from-primary/5 to-accent/5'>
			{/* Desktop Layout */}
			<div className='hidden lg:flex min-h-screen'>
				{/* Left Panel - Carousel */}
				<div className='flex flex-1 justify-center items-stretch w-full bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden'>
					<div className='w-full flex flex-col justify-center items-center p-12'>
						<div className='w-full max-w-md mb-8 relative'>
							<div className='relative h-96 rounded-2xl shadow-2xl overflow-hidden'>
								{carouselImagesSrcs.map((image, index) => (
									<div
										key={index}
										className={`absolute inset-0 transition-opacity duration-500 ${
											index === currentImageIndex ? 'opacity-100' : 'opacity-0'
										}`}
									>
										<Image
											src={image.src || '/placeholder.svg'}
											alt={image.alt}
											fill
											sizes='500px'
											style={{ objectFit: 'cover' }}
											priority={index === currentImageIndex}
										/>
										<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6'>
											<div className='text-white'>
												<div className='text-4xl font-bold mb-2'>
													{t(`carousel.stats.${image.statKey}`)}
												</div>
												<div className='text-sm opacity-90'>
													{t(`carousel.stats.${image.descKey}`)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className='flex justify-center space-x-2 mt-4'>
								{carouselImagesSrcs.map((_, index) => (
									<Button
										key={index}
										size='icon'
										onClick={() => setCurrentImageIndex(index)}
										className={cn(
											'w-2 h-2 rounded-full transition-all p-0',
											index === currentImageIndex
												? 'bg-primary w-6'
												: 'bg-primary/30'
										)}
									/>
								))}
							</div>
						</div>

						<div className='text-center space-y-6 max-w-md'>
							<div className='bg-primary text-primary-foreground px-4 py-2 rounded-full inline-flex items-center space-x-2 shadow-lg'>
								<GraduationCap className='w-4 h-4' />
								<span className='font-semibold text-sm'>
									{t('carousel.nsdcPartner')}
								</span>
							</div>

							<div className='space-y-3'>
								<p className='text-sm text-muted-foreground font-medium'>
									{t('carousel.trustedByCompanies')}
								</p>
								<div className='flex items-center justify-center space-x-6'>
									<div className='relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2'>
										<div className='relative w-full h-full'>
											<Image
												src='/tcs-logo.jpg'
												alt='TCS'
												fill
												sizes='40px'
												style={{ objectFit: 'cover' }}
											/>
										</div>
									</div>
									<div className='relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2'>
										<div className='relative w-full h-full'>
											<Image
												src='/swiggy-logo.jpg'
												alt='Swiggy'
												fill
												sizes='40px'
												style={{ objectFit: 'cover' }}
											/>
										</div>
									</div>
									<div className='relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2'>
										<div className='relative w-full h-full'>
											<Image
												src='/reliance-logo.jpg'
												alt='Reliance'
												fill
												sizes='40px'
												style={{ objectFit: 'cover' }}
											/>
										</div>
									</div>
									<div className='relative w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md p-2'>
										<div className='relative w-full h-full'>
											<Image
												src='/lt-logo.jpg'
												alt='L&T'
												fill
												sizes='40px'
												style={{ objectFit: 'cover' }}
											/>
										</div>
									</div>
								</div>
								<p className='text-sm text-muted-foreground'>
									{t('carousel.moreCompanies')}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right Panel - Content Area */}
				<div className='max-w-[440px] bg-background flex flex-col w-full'>
					<div className='p-6 border-b'>
						<div className='flex items-center justify-between'>
							<Link
								href={'/'}
								className='flex items-center space-x-3 hover:opacity-80 transition-opacity'
							>
								<div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md'>
									<span className='text-primary-foreground font-bold'>₹</span>
								</div>
								<div className='flex flex-col'>
									<span className='font-bold text-xl text-primary leading-none'>
										Rozgari
									</span>
									<span className='text-xs text-muted-foreground'>
										{t('carousel.poweredBy')}
									</span>
								</div>
							</Link>
							<LanguageSwitcher />
						</div>
					</div>
					{children}
				</div>
			</div>

			{/* Mobile Layout */}
			<div className='lg:hidden min-h-screen flex flex-col bg-background'>
				{children}
			</div>
		</div>
	)
}
