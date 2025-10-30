'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Briefcase,
	GraduationCap,
	TrendingUp,
	ChevronLeft,
	ChevronRight,
	Volume2,
	Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
	const [currentCard, setCurrentCard] = useState(0)
	const [isVoicePlaying, setIsVoicePlaying] = useState(false)
	const t = useTranslations()
	const router = useRouter()

	const cards = [
		{
			icon: Briefcase,
			iconColor: 'text-green-600',
			listColor: 'bg-green-600',
			bgColor: 'bg-green-100',
			title: t('introduction.earning.title'),
			description: t('introduction.earning.description'),
			points: [
				t('introduction.earning.point1'),
				t('introduction.earning.point2'),
				t('introduction.earning.point3'),
			],
			image: '/indian-worker-earning-money-happily.jpg',
		},
		{
			icon: GraduationCap,
			iconColor: 'text-blue-600',
			listColor: 'bg-blue-600',
			bgColor: 'bg-blue-100',
			title: t('introduction.learning.title'),
			description: t('introduction.learning.description'),
			points: [
				t('introduction.learning.point1'),
				t('introduction.learning.point2'),
				t('introduction.learning.point3'),
			],
			image: '/indian-worker-learning-in-training-class.jpg',
		},
		{
			icon: TrendingUp,
			iconColor: 'text-purple-600',
			listColor: 'bg-purple-600',
			bgColor: 'bg-purple-100',
			title: t('introduction.growing.title'),
			description: t('introduction.growing.description'),
			points: [
				t('introduction.growing.point1'),
				t('introduction.growing.point2'),
				t('introduction.growing.point3'),
			],
			image: '/indian-worker-career-growth-success.jpg',
		},
		{
			icon: Sparkles,
			iconColor: 'text-orange-600',
			listColor: 'bg-orange-600',
			bgColor: 'bg-orange-100',
			title: t('introduction.smartFeatures.title'),
			description: t('introduction.smartFeatures.description'),
			points: [
				t('introduction.smartFeatures.point1'),
				t('introduction.smartFeatures.point2'),
				t('introduction.smartFeatures.point3'),
			],
			image: '/indian-worker-using-smartphone-app-for-job-search.jpg',
		},
	]

	const currentCardData = cards[currentCard]
	const Icon = currentCardData.icon

	const handleNext = () => {
		if (currentCard < cards.length - 1) {
			setCurrentCard(currentCard + 1)
		} else {
			router.push('/name-collection')
		}
	}

	const handlePrev = () => {
		if (currentCard > 0) {
			setCurrentCard(currentCard - 1)
		}
	}

	const handleVoicePlay = () => {
		setIsVoicePlaying(true)
		// Simulate voice playing (in real app, this would trigger actual TTS)
		setTimeout(() => setIsVoicePlaying(false), 3000)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col'>
			{/* Header */}
			<div className='bg-primary text-primary-foreground py-4 px-4'>
				<div className='max-w-md mx-auto'>
					<h1 className='text-xl font-bold'>Rozgari</h1>
					<p className='text-xs opacity-90'>{t('introduction.poweredBy')}</p>
				</div>
			</div>

			{/* Main Card Container */}
			<div className='flex-1 flex flex-col items-center justify-center px-4 py-6'>
				<div className='w-full max-w-md'>
					{/* Card */}
					<div className='bg-card rounded-2xl shadow-lg space-y-4'>
						<div className='relative w-full h-48 md:h-64 rounded-tr-lg rounded-tl-lg overflow-hidden bg-muted flex items-center justify-center'>
							<Image
								src={currentCardData.image || '/placeholder.svg'}
								alt={currentCardData.title}
								className='w-full h-full object-cover'
								fill
								priority
								sizes='500px'
							/>
						</div>

						<div className='p-6 space-y-4 flex flex-col'>
							{/* Icon and Title */}
							<div className='flex items-center gap-3'>
								<div className={`p-2 ${currentCardData.bgColor} rounded-lg`}>
									<Icon className={`w-6 h-6 ${currentCardData.iconColor}`} />
								</div>
								<h2 className='text-2xl font-bold'>{currentCardData.title}</h2>
							</div>
							{/* Description */}
							<p className='text-sm text-muted-foreground leading-relaxed'>
								{currentCardData.description}
							</p>
							{/* Bullet Points */}
							<ul className='space-y-2'>
								{currentCardData.points.map((point, index) => (
									<li key={index} className='flex items-center gap-2 text-sm'>
										<span
											className={`w-1.5 h-1.5 rounded-full ${currentCardData.listColor} flex-shrink-0`}
										/>
										<span>{point}</span>
									</li>
								))}
							</ul>
							{/* Voice Assistant Button */}
							<button
								onClick={handleVoicePlay}
								className='w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer'
								disabled={isVoicePlaying}
							>
								<Volume2
									className={`w-4 h-4 ${isVoicePlaying ? 'animate-pulse' : ''}`}
								/>
								<span className='text-sm'>
									{isVoicePlaying ? 'Playing...' : 'Listen to this'}
								</span>
							</button>
						</div>
					</div>

					{/* Progress Dots */}
					<div className='flex justify-center gap-2 mt-6'>
						{cards.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentCard(index)}
								className={`h-2 rounded-full transition-all cursor-pointer ${
									index === currentCard
										? 'w-8 bg-primary'
										: 'w-2 bg-muted-foreground/30'
								}`}
								aria-label={`Go to card ${index + 1}`}
							/>
						))}
					</div>

					{/* Navigation Buttons */}
					<div className='flex gap-3 mt-6'>
						<Button
							variant='outline'
							onClick={handlePrev}
							className='flex-1 flex items-center bg-transparent disabled:hover:bg-transparent cursor-pointer'
							disabled={currentCard <= 0}
						>
							<ChevronLeft className='w-4 h-4 mr-1 mt-[1px]' />
							{t('common.back')}
						</Button>
						<Button onClick={handleNext} className='flex-1 flex items-center cursor-pointer'>
							{currentCard < cards.length - 1 ? (
								<>
									{t('common.next')}
									<ChevronRight className='w-4 h-4 ml-1 mt-[1px]' />
								</>
							) : (
								<>
									Start Profile Creation
									<ChevronRight className='w-4 h-4 ml-1 mt-[1px]' />
								</>
							)}
						</Button>
					</div>

					{/* Skip Option */}
					<button
						onClick={() => router.push('/name-collection')}
						className='w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors cursor-pointer'
					>
						{t('common.skip')}
					</button>
				</div>
			</div>
		</div>
	)
}
