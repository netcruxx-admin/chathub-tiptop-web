'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import {
	ArrowLeft,
	Check,
	X,
	Loader2,
	ChevronDown,
	ChevronUp,
	Mic,
	Play,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import BackBtn from '@/components/backBtn'
import { useFormik } from 'formik'
import { createNameCollectionValidation } from '@/lib/validation/authValidation'
import type { NameCollectionValidationValues } from '@/types/validation'

export default function NameCollection() {
	const router = useRouter()
	const t = useTranslations()

	const [showAdvanced, setShowAdvanced] = useState(false)
	const [showVoicePreview, setShowVoicePreview] = useState(false)
	const [voicePreviewPlayed, setVoicePreviewPlayed] = useState(false)

	// Availability checks
	const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
		null
	)
	const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
	const [checkingUsername, setCheckingUsername] = useState(false)
	const [checkingEmail, setCheckingEmail] = useState(false)

	const formik = useFormik<NameCollectionValidationValues>({
		initialValues: {
			firstName: '',
			middleName: '',
			lastName: '',
			username: '',
			email: '',
		},
		validationSchema: createNameCollectionValidation(t),
		onSubmit: (values) => {
			// Store data and navigate
			localStorage.setItem('nameData', JSON.stringify(values))
			router.push('/flow-selection')
		},
	})

	useEffect(() => {
		// Auto-generate username and email when component mounts
		const phoneNumber = new URLSearchParams(window.location.search).get('phone')
		if (phoneNumber) {
			const generatedUsername = phoneNumber
			const generatedEmail = generateEmail(phoneNumber)
			formik.setFieldValue('username', generatedUsername)
			formik.setFieldValue('email', generatedEmail)
			checkUsername(generatedUsername)
			checkEmail(generatedEmail)
		}
	}, [])

	const generateEmail = (user: string) => {
		return `${user}@tiptopmail.com`
	}

	const checkUsername = (value: string) => {
		if (!value) return
		setCheckingUsername(true)
		// Simulate API call - always return true for demo
		setTimeout(() => {
			setUsernameAvailable(true)
			setCheckingUsername(false)
		}, 1000)
	}

	const checkEmail = (value: string) => {
		if (!value) return
		setCheckingEmail(true)
		// Simulate API call - always return true for demo
		setTimeout(() => {
			setEmailAvailable(true)
			setCheckingEmail(false)
		}, 1000)
	}

	const handleUsernameChange = (value: string) => {
		formik.setFieldValue('username', value)
		const newEmail = generateEmail(value)
		formik.setFieldValue('email', newEmail)
		checkUsername(value)
		checkEmail(newEmail)
	}

	const handleVoicePreview = () => {
		setShowVoicePreview(true)
		setVoicePreviewPlayed(true)
		// Simulate voice preview
		setTimeout(() => {
			setShowVoicePreview(false)
		}, 3000)
	}

	const isValid =
		formik.isValid &&
		formik.values.firstName &&
		formik.values.lastName &&
		formik.values.username &&
		formik.values.email &&
		usernameAvailable &&
		emailAvailable

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
					className='mr-2 cursor-pointer'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<div>
					<h1 className='text-lg font-semibold'>{t('nameCollection.title')}</h1>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-4 sm:p-6'>
				<div className='max-w-md mx-auto space-y-6'>
					<div className='text-center space-y-2 pb-2'>
						<p className='text-base text-foreground font-medium'>
							{t('nameCollection.subtitle')}
						</p>
					</div>
					{/* Voice Assistant Card */}
					<div className='bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20 rounded-xl p-4'>
						<div className='flex items-start gap-3'>
							<div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0'>
								<Mic className='w-5 h-5 text-primary' />
							</div>
							<div className='flex-1 min-w-0'>
								<h3 className='font-semibold text-sm mb-1'>
									Voice Assistant Available
								</h3>
								<p className='text-xs text-muted-foreground mb-3'>
									I can help you. Tap to hear how
								</p>
								<Button
									size='sm'
									variant={voicePreviewPlayed ? 'outline' : 'default'}
									onClick={handleVoicePreview}
									disabled={showVoicePreview}
									className='h-8 text-xs cursor-pointer'
								>
									{showVoicePreview ? (
										<>
											<Loader2 className='w-3 h-3 mr-1 animate-spin' />
											Playing...
										</>
									) : (
										<>
											<Play className='w-3 h-3 mr-1' />
											{voicePreviewPlayed ? 'Play Again' : 'Preview Voice Help'}
										</>
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Name Input Fields */}
					<div className='space-y-4 p-5 bg-card rounded-xl border shadow-sm'>
						<div>
							<div className='flex items-center justify-between mb-2'>
								<Label htmlFor='firstName' className='text-sm font-medium'>
									{t('nameCollection.firstName')}
								</Label>
								<span className='text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded'>
									{t('common.required')}
								</span>
							</div>
							<Input
								id='firstName'
								name='firstName'
								value={formik.values.firstName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder={t('nameCollection.firstNamePlaceholder')}
								className='h-11 text-base'
								autoFocus
							/>
							{formik.touched.firstName && formik.errors.firstName && (
								<p className='text-xs text-red-600 mt-1'>{formik.errors.firstName}</p>
							)}
						</div>

						<div>
							<div className='flex items-center justify-between mb-2'>
								<Label htmlFor='lastName' className='text-sm font-medium'>
									{t('nameCollection.lastName')}
								</Label>
								<span className='text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded'>
									{t('common.required')}
								</span>
							</div>
							<Input
								id='lastName'
								name='lastName'
								value={formik.values.lastName}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								placeholder={t('nameCollection.lastNamePlaceholder')}
								className='h-11 text-base'
							/>
							{formik.touched.lastName && formik.errors.lastName && (
								<p className='text-xs text-red-600 mt-1'>{formik.errors.lastName}</p>
							)}
						</div>
					</div>

					{/* Advanced Options */}
					<div className='border rounded-lg overflow-hidden'>
						<button
							onClick={() => setShowAdvanced(!showAdvanced)}
							className='w-full p-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer'
						>
							<div className='flex items-center space-x-2'>
								<span className='text-sm font-medium'>
									{t('nameCollection.autoGenerate')}
								</span>
								{!showAdvanced && usernameAvailable && emailAvailable && (
									<Check className='w-4 h-4 text-green-500' />
								)}
							</div>
							{showAdvanced ? (
								<ChevronUp className='w-4 h-4' />
							) : (
								<ChevronDown className='w-4 h-4' />
							)}
						</button>

						{showAdvanced && (
							<div className='p-4 space-y-4 bg-background'>
								<div>
									<Label htmlFor='username' className='text-sm'>
										{t('nameCollection.username')}
									</Label>
									<div className='relative mt-1'>
										<Input
											id='username'
											name='username'
											value={formik.values.username}
											onChange={e => handleUsernameChange(e.target.value)}
											onBlur={formik.handleBlur}
											placeholder={t('nameCollection.usernamePlaceholder')}
											className='pr-10'
										/>
										<div className='absolute right-3 top-1/2 -translate-y-1/2'>
											{checkingUsername && (
												<Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
											)}
											{!checkingUsername && usernameAvailable === true && (
												<Check className='w-4 h-4 text-green-500' />
											)}
											{!checkingUsername && usernameAvailable === false && (
												<X className='w-4 h-4 text-red-500' />
											)}
										</div>
									</div>
									{formik.touched.username && formik.errors.username && (
										<p className='text-xs text-red-600 mt-1'>{formik.errors.username}</p>
									)}
									{!checkingUsername && usernameAvailable === true && !formik.errors.username && (
										<p className='text-xs text-green-600 mt-1'>{t('nameCollection.available')}</p>
									)}
									{!checkingUsername && usernameAvailable === false && (
										<p className='text-xs text-red-600 mt-1'>{t('nameCollection.taken')}</p>
									)}
									{!formik.errors.username && (
										<p className='text-xs text-muted-foreground mt-1'>
											{t('nameCollection.usernameHint')}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor='email' className='text-sm'>
										{t('nameCollection.email')}
									</Label>
									<div className='relative mt-1'>
										<Input
											id='email'
											name='email'
											value={formik.values.email}
											readOnly
											className='bg-muted pr-10'
										/>
										<div className='absolute right-3 top-1/2 -translate-y-1/2'>
											{checkingEmail && (
												<Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
											)}
											{!checkingEmail && emailAvailable === true && (
												<Check className='w-4 h-4 text-green-500' />
											)}
											{!checkingEmail && emailAvailable === false && (
												<X className='w-4 h-4 text-red-500' />
											)}
										</div>
									</div>
									{formik.touched.email && formik.errors.email && (
										<p className='text-xs text-red-600 mt-1'>{formik.errors.email}</p>
									)}
									{!checkingEmail && emailAvailable === true && !formik.errors.email && (
										<p className='text-xs text-green-600 mt-1'>{t('nameCollection.available')}</p>
									)}
									{!checkingEmail && emailAvailable === false && (
										<p className='text-xs text-red-600 mt-1'>{t('nameCollection.taken')}</p>
									)}
								</div>
							</div>
						)}
					</div>

					<Button
						onClick={() => formik.handleSubmit()}
						disabled={!isValid}
						className='w-full h-12 text-base font-semibold cursor-pointer'
					>
						{t('common.continue')}
					</Button>
				</div>
			</div>
		</div>
	)
}
