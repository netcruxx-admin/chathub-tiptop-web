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
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useSignupMutation } from '@/redux/apis/authApi'
import { updateUser } from '@/redux/slices/authSlice'
// import { REACT_APP_TENANT_ID } from '@/lib/constants'

export default function NameCollection() {
	const router = useRouter()
	const t = useTranslations()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [showAdvanced, setShowAdvanced] = useState(true)
	const [showVoicePreview, setShowVoicePreview] = useState(false)
	const [voicePreviewPlayed, setVoicePreviewPlayed] = useState(false)
	const [error, setError] = useState('')

	// Availability checks
	const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
		null
	)
	const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
	const [checkingUsername, setCheckingUsername] = useState(false)
	const [checkingEmail, setCheckingEmail] = useState(false)

	const phoneNumber = useSelector((state: RootState) => state.auth.user.Phone)
	const dispatch = useDispatch()
	const [signUpUser, { isLoading: isLoading }] = useSignupMutation()

	useEffect(() => {
		// Auto-generate username and email when component mounts
		if (phoneNumber) {
			const generatedUsername = phoneNumber
			const generatedEmail = generateEmail(phoneNumber)
			setUsername(generatedUsername)
			setEmail(generatedEmail)
			checkUsername(generatedUsername)
			checkEmail(generatedEmail)
		}
	}, [phoneNumber])

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
		setUsername(value)
		const newEmail = generateEmail(value)
		setEmail(newEmail)
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

	const handleContinue = async () => {
		// Store data and navigate
		// const nameData = {
		// 	firstName,
		// 	lastName,
		// 	username,
		// 	email,
		// }
		// You can store this in Redux or localStorage
		// localStorage.setItem('nameData', JSON.stringify(nameData))

		// Navigate to next step
		// router.push('/flow-selection')
		console.log('Handle Continue working')
		try {
			setError('')
			const response = await signUpUser({
				Rid: 0,
				Title: '',
				FirstName: firstName,
				MiddleName: '',
				LastName: lastName,
				UserName: username,
				Email: email,
				DOB: '',
				Gender: '',
				BirthPlace: '',
				Marital: '',
				FatherName: '',
				MotherName: '',
				MobileNo: phoneNumber,
				Address1: '',
				Password: '',
				City: '',
				State: '',
				Country: '',
				SecretQuestion: '',
				SecretAnswer: '',
				TenantGroupId: 3,
				Remark: '',
			}).unwrap()
			console.log('response', response)
			// if (response && response.Status === 0) {
			dispatch(
				updateUser({
					Email: email,
					FirstName: firstName,
					LastName: lastName,
					UserName: username,
				})
			)
			// Navigate to OTP page
			// router.push(`/signup-otp?number=${values.phoneNumber}`)
			// }

			// Save phone number to Redux
			router.push(`/flow-selection`)
		} catch (err: any) {
			console.error('Failed to send OTP:', err)
			setError(err?.data?.message || 'Failed to send OTP. Please try again.')
		}
	}

	const isValid =
		firstName &&
		lastName &&
		username &&
		email &&
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
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
								placeholder={t('nameCollection.firstNamePlaceholder')}
								className='h-11 text-base'
								autoFocus
							/>
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
								value={lastName}
								onChange={e => setLastName(e.target.value)}
								placeholder={t('nameCollection.lastNamePlaceholder')}
								className='h-11 text-base'
							/>
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
											value={username}
											onChange={e => handleUsernameChange(e.target.value)}
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
									{!checkingUsername && usernameAvailable === true && (
										<p className='text-xs text-green-600 mt-1'>
											{t('nameCollection.available')}
										</p>
									)}
									{!checkingUsername && usernameAvailable === false && (
										<p className='text-xs text-red-600 mt-1'>
											{t('nameCollection.taken')}
										</p>
									)}
									<p className='text-xs text-muted-foreground mt-1'>
										{t('nameCollection.usernameHint')}
									</p>
								</div>

								<div>
									<Label htmlFor='email' className='text-sm'>
										{t('nameCollection.email')}
									</Label>
									<div className='relative mt-1'>
										<Input
											id='email'
											value={email}
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
									{!checkingEmail && emailAvailable === true && (
										<p className='text-xs text-green-600 mt-1'>
											{t('nameCollection.available')}
										</p>
									)}
									{!checkingEmail && emailAvailable === false && (
										<p className='text-xs text-red-600 mt-1'>
											{t('nameCollection.taken')}
										</p>
									)}
								</div>
							</div>
						)}
					</div>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<Button
						onClick={handleContinue}
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
