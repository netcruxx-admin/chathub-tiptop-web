'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Scan } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/authSlice'

export default function FormBasedProfile() {
	const router = useRouter()
	const t = useTranslations()
	const dispatch = useDispatch()

	const phoneNumber = useSelector((state: RootState) => state.auth.user.Phone)
	const email = useSelector((state: RootState) => state.auth.user.Email)
	const userData = useSelector((state: RootState) => state.auth.user)

	const [step, setStep] = useState(1)
	const [formData, setFormData] = useState({
		firstName: userData?.FirstName || '',
		lastName: userData?.LastName || '',
		dateOfBirth: userData?.DOB || '',
		aadhaarNumber: userData?.AadharNumber || '',
	})

	// Load saved name data if available from localStorage (fallback)
	useEffect(() => {
		const savedData = localStorage.getItem('nameData')
		if (savedData) {
			const parsed = JSON.parse(savedData)
			setFormData(prev => ({
				...prev,
				firstName: parsed.firstName || prev.firstName,
				lastName: parsed.lastName || prev.lastName,
			}))
		}
	}, [])

	const handleNext = () => {
		// Save form data to Redux
		const profileData = {
			...formData,
			username: phoneNumber,
			email: email,
		}
		dispatch(
			updateUser({
				FirstName: formData.firstName,
				LastName: formData.lastName,
				DOB: formData.dateOfBirth,
				AadharNumber: formData.aadhaarNumber,
			})
		)

		// Also save to localStorage as backup
		localStorage.setItem('profileData', JSON.stringify(profileData))

		// Go to skills wizard
		router.push('/skills-wizard')
	}

	const handleAadhaarScan = () => {
		// Save current form data before navigating
		const profileData = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			dateOfBirth: formData.dateOfBirth,
			username: phoneNumber,
			email: `${phoneNumber}@tiptopmail.com`,
		}
		// dispatch(setuserData(profileData))
		localStorage.setItem('profileData', JSON.stringify(profileData))
		router.push('/aadhaar-scan')
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => (step === 1 ? router.back() : setStep(1))}
					className='mr-2 cursor-pointer'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<div>
					<h1 className='text-lg font-semibold'>{t('profileForm.title')}</h1>
					<p className='text-xs text-muted-foreground'>
						{t('profileForm.subtitle')}
					</p>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-4 sm:p-6'>
				<div className='max-w-md mx-auto'>
					{step === 1 && (
						<div className='space-y-4'>
							<Button
								onClick={handleAadhaarScan}
								variant='outline'
								className='w-full h-12 border-2 border-primary/20 hover:border-primary bg-transparent cursor-pointer'
							>
								<Scan className='w-5 h-5 mr-2' />
								{t('profileForm.scanAadhaar')}
							</Button>

							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<span className='w-full border-t' />
								</div>
								<div className='relative flex justify-center text-xs uppercase'>
									<span className='bg-background px-2 text-muted-foreground'>
										{t('profileForm.orDivider')}
									</span>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.firstName')}
								</label>
								<input
									type='text'
									value={formData.firstName}
									onChange={e =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder={t('profileForm.firstName')}
								/>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.lastName')}
								</label>
								<input
									type='text'
									value={formData.lastName}
									onChange={e =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder={t('profileForm.lastName')}
								/>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.dob')}
								</label>
								<input
									type='date'
									value={formData.dateOfBirth}
									onChange={e =>
										setFormData({ ...formData, dateOfBirth: e.target.value })
									}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.aadhaar')}
								</label>
								<input
									type='text'
									value={formData.aadhaarNumber}
									onChange={e =>
										setFormData({ ...formData, aadhaarNumber: e.target.value })
									}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder='XXXX XXXX XXXX'
									maxLength={12}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className='p-4 border-t'>
				<Button
					onClick={handleNext}
					disabled={
						!formData.firstName || !formData.lastName || !formData.dateOfBirth
					}
					className='w-full cursor-pointer'
					size='lg'
				>
					{t('common.next')}
					<ArrowRight className='w-5 h-5 ml-2' />
				</Button>
			</div>
		</div>
	)
}
