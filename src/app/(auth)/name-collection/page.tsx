'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle2, Shield } from 'lucide-react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useSignupMutation } from '@/redux/apis/authApi'
import { updateUser } from '@/redux/slices/authSlice'
import { toast } from 'sonner'
import { clearAadhaarData } from '@/redux/slices/formSlice'

// Helper function to reformat date
const reformatDate = (dateStr: string | undefined): string => {
	if (!dateStr || dateStr === 'Not found') return ''
	// Handles DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
	const parts = dateStr.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/)
	if (parts && parts.length === 4) {
		const dd = parts[1].padStart(2, '0')
		const mm = parts[2].padStart(2, '0')
		const yyyy = parts[3]
		return `${yyyy}-${mm}-${dd}`
	}
	if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
		return dateStr
	}
	console.warn('Unrecognized date format:', dateStr)
	return ''
}

export default function NameCollection() {
	const t = useTranslations()
	const router = useRouter()
	const dispatch = useDispatch()
	const [aadhaarFilled, setAadhaarFilled] = useState(false)

	// Get data from Redux
	const phoneNumber = useSelector((state: RootState) => state.auth.user.Phone)
	const ocrData = useSelector((state: RootState) => state.form.ocrData)
	const [signUpUser] = useSignupMutation()

	// --- FIX #2: Move initialValues INSIDE the component ---
	const initialValues = {
		firstName:
			ocrData?.FirstName !== 'Not found' ? ocrData?.FirstName || '' : '',
		lastName: ocrData?.LastName !== 'Not found' ? ocrData?.LastName || '' : '',
		dateOfBirth: reformatDate(ocrData?.DOB),
		gender: ocrData?.Sex !== 'not found' ? ocrData?.Sex || '' : '',
	}
	// --- END OF FIX #2 ---

	// Validation Schema
	const NameCollectionSchema = Yup.object().shape({
		firstName: Yup.string()
			.min(2, t('nameCollectionPage.validationFirstNameMin'))
			.required(t('nameCollectionPage.validationFirstNameRequired')),
		lastName: Yup.string(),
		dateOfBirth: Yup.date()
			.max(new Date(), t('nameCollectionPage.validationDobMax'))
			.required(t('nameCollectionPage.validationDobRequired')),
		gender: Yup.string()
			.oneOf(
				['Male', 'Female', 'Transgender', 'others'],
				t('nameCollectionPage.validationGenderOneOf')
			)
			.required(t('nameCollectionPage.validationGenderRequired')),
	})

	const genderOptions = [
		{ value: 'Male', label: t('nameCollectionPage.genderMale') },
		{ value: 'Female', label: t('nameCollectionPage.genderFemale') },
		{ value: 'Transgender', label: t('nameCollectionPage.genderTransgender') },
		{ value: 'others', label: t('nameCollectionPage.genderOther') },
	]

	const generateEmail = (username: string) => {
		if (!username) return ''
		return `${username}@rozgari.com`
	}

	// This function is correctly passed to Formik's onSubmit prop
	const handleSubmit = async (values: typeof initialValues) => {
		console.log('Form submitted:', values)
		const username = phoneNumber
		const email = generateEmail(username)

		try {
			console.log(values)
			const response = await signUpUser({
				Rid: 0,
				Title: '',
				FirstName: values.firstName,
				MiddleName: '',
				LastName: values.lastName || '', // Pass lastName or empty string
				UserName: username,
				Email: email,
				DOB: values.dateOfBirth,
				Gender: values.gender,
				BirthPlace: '',
				Marital: '',
				FatherName: '',
				MotherName: '',
				MobileNo: Number(phoneNumber),
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
			if (response && response.Status === 0) {
				dispatch(
					updateUser({
						Email: email,
						FirstName: values.firstName,
						LastName: values.lastName,
						UserName: username,
					})
				)
				// router.push(`/flow-selection`)
			} else {
				toast.error(response?.Message || 'Signup failed. Please try again.')
			}
		} catch (err: any) {
			console.error('Failed to sign up:', err)
			toast.error(err?.data?.message || 'Failed to sign up. Please try again.')
		}
		//! API bypass
		router.push(`/flow-selection`)
	}

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col'>
			{/* Header */}
			<div className='sticky top-0 z-10 bg-white border-b'>
				<div className='p-4 flex items-center'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.back()}
						className='mr-3 hover:bg-gray-100'
					>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<div>
						<h1 className='text-lg font-semibold text-gray-900'>
							{t('nameCollectionPage.header')}
						</h1>
						<p className='text-xs text-gray-500'>
							{t('nameCollectionPage.step')}
						</p>
					</div>
				</div>
			</div>

			<Formik
				initialValues={initialValues}
				validationSchema={NameCollectionSchema}
				onSubmit={handleSubmit}
				enableReinitialize // This tells Formik to reset when initialValues changes
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit, // This is Formik's trigger function
					isValid,
					setFieldValue,
				}) => {
					// Effect to set aadhaarFilled state
					useEffect(() => {
						if (ocrData) {
							setAadhaarFilled(true)
						}
					}, [ocrData])

					// Clear Redux data on unmount
					// useEffect(() => {
					// 	return () => {
					// 		dispatch(clearAadhaarData())
					// 	}
					// }, [dispatch])

					const username = phoneNumber
					const email = generateEmail(username)

					return (
						<div className='flex-1 overflow-y-auto'>
							<div className='max-w-2xl mx-auto p-4 space-y-4'>
								{aadhaarFilled && (
									<div className='bg-green-50 border-l-4 border-green-500 rounded-lg p-3 shadow-sm'>
										<div className='flex items-center gap-2.5'>
											<div className='w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-md'>
												<CheckCircle2 className='w-4 h-4 text-white' />
											</div>
											<div className='flex-1'>
												<p className='font-semibold text-xs text-green-900'>
													{t('nameCollectionPage.aadhaarSuccessTitle')}
												</p>
												<p className='text-xs text-green-700 mt-0.5'>
													{t('nameCollectionPage.aadhaarSuccessDesc')}
												</p>
											</div>
										</div>
									</div>
								)}

								<div className='bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden'>
									<div className='p-4 sm:p-5 space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-3.5'>
											<div className='space-y-1.5'>
												<Label
													htmlFor='firstName'
													className='text-sm font-semibold text-gray-900'
												>
													{t('nameCollectionPage.firstNameLabel')}{' '}
													<span className='text-red-500'>*</span>
												</Label>
												<Input
													id='firstName'
													name='firstName'
													value={values.firstName}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder={t(
														'nameCollectionPage.firstNamePlaceholder'
													)}
													className='h-11 text-base border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg transition-all'
													// disabled={aadhaarFilled} // <-- Re-enabled this
												/>
												{touched.firstName && errors.firstName && (
													<p className='text-xs text-red-500 mt-1'>
														{errors.firstName}
													</p>
												)}
											</div>

											<div className='space-y-1.5'>
												<Label
													htmlFor='lastName'
													className='text-sm font-semibold text-gray-900'
												>
													{t('nameCollectionPage.lastNameLabel')}{' '}
												</Label>
												<Input
													id='lastName'
													name='lastName'
													value={values.lastName}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder={t(
														'nameCollectionPage.lastNamePlaceholder'
													)}
													className='h-11 text-base border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg transition-all'
													// disabled={aadhaarFilled} // <-- Re-enabled this
												/>
												{touched.lastName && errors.lastName && (
													<p className='text-xs text-red-500 mt-1'>
														{errors.lastName}
													</p>
												)}
											</div>
										</div>

										<div className='space-y-1.5'>
											<Label
												htmlFor='dateOfBirth'
												className='text-sm font-semibold text-gray-900'
											>
												{t('nameCollectionPage.dobLabel')}{' '}
												<span className='text-red-500'>*</span>
											</Label>
											<div className='relative'>
												<Input
													id='dateOfBirth'
													name='dateOfBirth'
													type='date'
													value={values.dateOfBirth}
													onChange={handleChange}
													onBlur={handleBlur}
													className='h-11 text-base border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-lg transition-all'
													// disabled={aadhaarFilled} // <-- Re-enabled this
												/>
											</div>
											{touched.dateOfBirth && errors.dateOfBirth && (
												<p className='text-xs text-red-500 mt-1'>
													{errors.dateOfBirth}
												</p>
											)}
										</div>

										<div className='space-y-1.5'>
											<Label className='text-sm font-semibold text-gray-900'>
												{t('nameCollectionPage.genderLabel')}{' '}
												<span className='text-red-500'>*</span>
											</Label>
											<div className='grid grid-cols-2 gap-2.5'>
												{genderOptions.map(option => (
													<button
														key={option.value}
														type='button'
														onClick={() =>
															setFieldValue('gender', option.value)
														}
														// disabled={aadhaarFilled} // <-- Re-enabled this
														className={`
                                                            relative px-3 py-3 rounded-lg border-2 transition-all duration-200 font-semibold text-sm
                                                            ${
																															values.gender ===
																															option.value
																																? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/30'
																																: 'border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 text-gray-700 shadow-sm'
																														}
                                                        `}
													>
														{values.gender === option.value && (
															<CheckCircle2 className='absolute top-2 right-2 w-3.5 h-3.5 text-white' />
														)}
														{option.label}
													</button>
												))}
											</div>
											{touched.gender && errors.gender && (
												<p className='text-xs text-red-500 mt-1'>
													{errors.gender}
												</p>
											)}
										</div>
									</div>

									<div className='bg-gradient-to-br from-blue-50 to-indigo-50 border-t-2 border-gray-200 px-4 sm:px-5 py-4'>
										<div className='flex items-start gap-2.5'>
											<div className='w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md'>
												<Shield className='w-4 h-4 text-white' />
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-xs font-bold text-gray-700 uppercase tracking-wide mb-2.5'>
													{t('nameCollectionPage.autoGenTitle')}
												</p>
												<div className='space-y-2'>
													<div className='bg-white rounded-lg px-3 py-2 border border-gray-200'>
														<div className='space-y-0.5'>
															<span className='text-xs font-medium text-gray-600 block'>
																{t('nameCollectionPage.usernameLabel')}
															</span>
															<span className='font-mono text-xs sm:text-sm font-bold text-gray-900 block break-all'>
																{username ||
																	t('nameCollectionPage.usernamePlaceholder')}
															</span>
														</div>
													</div>
													<div className='bg-white rounded-lg px-3 py-2 border border-gray-200'>
														<div className='space-y-0.5'>
															<span className='text-xs font-medium text-gray-600 block'>
																{t('nameCollectionPage.emailLabel')}
															</span>
															<span className='font-mono text-xs sm:text-sm font-bold text-gray-900 block break-all'>
																{email ||
																	t('nameCollectionPage.emailPlaceholder')}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<Button
									type='button'
									onClick={() => handleSubmit()} // <-- FIX #1: Call with no arguments
									disabled={
										!isValid ||
										!values.firstName ||
										!values.dateOfBirth ||
										!values.gender
									}
									className='w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all hover:shadow-xl active:scale-[0.98] rounded-xl'
								>
									{t('nameCollectionPage.continueBtn')}
								</Button>
							</div>
						</div>
					)
				}}
			</Formik>
		</div>
	)
}
