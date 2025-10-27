'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Scan } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setProfileFormData } from '@/redux/slices/authSlice'
import { useFormik } from 'formik'
import { createFormBasedProfileValidation } from '@/lib/validation/authValidation'
import type { FormBasedProfileValidationValues } from '@/types/validation'

export default function FormBasedProfile() {
	const router = useRouter()
	const t = useTranslations()
	const dispatch = useDispatch()

	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber)
	const profileFormData = useSelector((state: RootState) => state.auth.profileFormData)

	const [step, setStep] = useState(1)

	const formik = useFormik<FormBasedProfileValidationValues>({
		initialValues: {
			firstName: profileFormData?.firstName || '',
			lastName: profileFormData?.lastName || '',
			dateOfBirth: profileFormData?.dateOfBirth || '',
			aadhaarNumber: profileFormData?.aadhaarNumber || '',
		},
		validationSchema: createFormBasedProfileValidation(t),
		onSubmit: (values) => {
			// Save form data to Redux
			const profileData = {
				...values,
				username: phoneNumber,
				email: `${phoneNumber}@tiptopmail.com`,
			}
			dispatch(setProfileFormData(profileData))

			// Also save to localStorage as backup
			localStorage.setItem('profileData', JSON.stringify(profileData))

			// Go to skills wizard
			router.push('/skills-wizard')
		},
	})

	// Load saved data from localStorage (including Aadhaar scan data)
	useEffect(() => {
		// Check if returning from Aadhaar scan
		const confirmedAadhaarData = localStorage.getItem('confirmedAadhaarData')
		const aadhaarDataConfirmed = localStorage.getItem('aadhaarDataConfirmed')

		if (confirmedAadhaarData && aadhaarDataConfirmed === 'true') {
			const parsed = JSON.parse(confirmedAadhaarData)
			formik.setValues({
				firstName: parsed.firstName || '',
				lastName: parsed.lastName || '',
				dateOfBirth: parsed.dateOfBirth || '',
				aadhaarNumber: parsed.aadhaarNumber || '',
			})
			// Clear the flag
			localStorage.removeItem('aadhaarDataConfirmed')
		} else {
			// Fallback to nameData
			const savedData = localStorage.getItem('nameData')
			if (savedData) {
				const parsed = JSON.parse(savedData)
				formik.setValues({
					...formik.values,
					firstName: parsed.firstName || formik.values.firstName,
					lastName: parsed.lastName || formik.values.lastName,
				})
			}
		}
	}, [])

	const handleAadhaarScan = () => {
		// Save current form data before navigating
		const profileData = {
			firstName: formik.values.firstName,
			lastName: formik.values.lastName,
			dateOfBirth: formik.values.dateOfBirth,
			username: phoneNumber,
			email: `${phoneNumber}@tiptopmail.com`,
		}
		dispatch(setProfileFormData(profileData))
		localStorage.setItem('profileData', JSON.stringify(profileData))

		// Set onboarding flow to 'form' so review page knows to return here
		localStorage.setItem('onboardingFlow', 'form')

		// Skip the offer page and go directly to camera
		router.push('/aadhaar-camera')
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() =>
						step === 1 ? router.back() : setStep(1)
					}
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
									name='firstName'
									value={formik.values.firstName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder={t('profileForm.firstName')}
								/>
								{formik.touched.firstName && formik.errors.firstName && (
									<p className='text-xs text-red-600 mt-1'>{formik.errors.firstName}</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.lastName')}
								</label>
								<input
									type='text'
									name='lastName'
									value={formik.values.lastName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder={t('profileForm.lastName')}
								/>
								{formik.touched.lastName && formik.errors.lastName && (
									<p className='text-xs text-red-600 mt-1'>{formik.errors.lastName}</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.dob')}
								</label>
								<input
									type='date'
									name='dateOfBirth'
									value={formik.values.dateOfBirth}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
								/>
								{formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
									<p className='text-xs text-red-600 mt-1'>{formik.errors.dateOfBirth}</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('profileForm.aadhaar')}
								</label>
								<input
									type='text'
									name='aadhaarNumber'
									value={formik.values.aadhaarNumber}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
									placeholder='XXXX XXXX XXXX'
									maxLength={12}
								/>
								{formik.touched.aadhaarNumber && formik.errors.aadhaarNumber && (
									<p className='text-xs text-red-600 mt-1'>{formik.errors.aadhaarNumber}</p>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className='p-4 border-t'>
				<Button
					onClick={() => formik.handleSubmit()}
					disabled={!formik.isValid || !formik.values.firstName || !formik.values.lastName || !formik.values.dateOfBirth}
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
