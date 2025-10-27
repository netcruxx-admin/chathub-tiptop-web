'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2, Navigation, X, Edit2, Check } from 'lucide-react'
import { useFormik } from 'formik'
import { createLocationSelectionValidation } from '@/lib/validation/authValidation'
import type { LocationSelectionValidationValues } from '@/types/validation'

interface DetailedAddress {
	addressLine1: string
	addressLine2: string
	area: string
	city: string
	state: string
	pincode: string
	latitude?: number
	longitude?: number
}

export default function LocationDetection() {
	const t = useTranslations()
	const router = useRouter()
	const [detecting, setDetecting] = useState(false)
	const [detectedAddress, setDetectedAddress] = useState<DetailedAddress | null>(null)
	const [manualEntry, setManualEntry] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [error, setError] = useState('')

	const formik = useFormik<LocationSelectionValidationValues>({
		initialValues: {
			addressLine1: '',
			addressLine2: '',
			area: '',
			city: '',
			state: '',
			pincode: '',
		},
		validationSchema: createLocationSelectionValidation(t),
		onSubmit: (values) => {
			const fullAddress = [
				values.addressLine1,
				values.addressLine2,
				values.area,
				values.city,
				values.state,
				values.pincode,
			]
				.filter(Boolean)
				.join(', ')

			// Save to localStorage
			localStorage.setItem('locationData', JSON.stringify({
				permanentAddress: fullAddress,
				addressLine1: values.addressLine1,
				addressLine2: values.addressLine2,
				area: values.area,
				city: values.city,
				state: values.state,
				pincode: values.pincode,
				latitude: detectedAddress?.latitude,
				longitude: detectedAddress?.longitude,
			}))

			// Navigate to next page
			router.push('/distance-selection')
		},
	})

	const detectLocation = () => {
		setDetecting(true)
		setError('')

		if (!navigator.geolocation) {
			setError(t('location.notSupported'))
			setDetecting(false)
			setManualEntry(true)
			return
		}

		navigator.geolocation.getCurrentPosition(
			async position => {
				try {
					const { latitude, longitude } = position.coords

					const response = await fetch(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
					)

					if (!response.ok) throw new Error('Geocoding failed')

					const data = await response.json()
					const addr = data.address

					const detectedAddr: DetailedAddress = {
						addressLine1: addr.road || addr.neighbourhood || '',
						addressLine2: addr.suburb || '',
						area: addr.suburb || addr.neighbourhood || addr.locality || '',
						city: addr.city || addr.town || addr.village || addr.state_district || '',
						state: addr.state || '',
						pincode: addr.postcode || '',
						latitude,
						longitude,
					}

					setDetectedAddress(detectedAddr)
					formik.setValues({
						addressLine1: detectedAddr.addressLine1,
						addressLine2: detectedAddr.addressLine2,
						area: detectedAddr.area,
						city: detectedAddr.city,
						state: detectedAddr.state,
						pincode: detectedAddr.pincode,
					})
					setDetecting(false)
				} catch (err) {
					console.error('Geocoding error:', err)
					setError(t('location.detectionFailed'))
					setDetecting(false)
					setManualEntry(true)
				}
			},
			err => {
				console.error('Geolocation error:', err)
				setError(t('location.permissionDenied'))
				setDetecting(false)
				setManualEntry(true)
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		)
	}

	const confirmLocation = () => {
		formik.handleSubmit()
	}

	const submitManualLocation = () => {
		formik.handleSubmit()
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4'>
			<div className='w-full max-w-2xl'>
				<div className='bg-background rounded-2xl shadow-xl p-6 space-y-6'>
					{/* Header */}
					<div className='text-center space-y-2'>
						<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
							<MapPin className='w-8 h-8 text-primary' />
						</div>
						<h1 className='text-2xl font-bold'>{t('location.title')}</h1>
						<p className='text-sm text-muted-foreground'>{t('location.subtitle')}</p>
					</div>

					{/* Auto-detection */}
					{!manualEntry && !detectedAddress && (
						<div className='space-y-4'>
							<Button
								onClick={detectLocation}
								disabled={detecting}
								className='w-full h-12 text-base cursor-pointer'
							>
								{detecting ? (
									<>
										<Loader2 className='w-5 h-5 mr-2 animate-spin' />
										{t('location.detecting')}
									</>
								) : (
									<>
										<Navigation className='w-5 h-5 mr-2' />
										{t('location.detectAuto')}
									</>
								)}
							</Button>

							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-border' />
								</div>
								<div className='relative flex justify-center text-xs uppercase'>
									<span className='bg-background px-2 text-muted-foreground'>{t('location.or')}</span>
								</div>
							</div>

							<Button
								onClick={() => setManualEntry(true)}
								variant='outline'
								className='w-full h-12 text-base cursor-pointer'
							>
								{t('location.enterManually')}
							</Button>
						</div>
					)}

					{/* Detected location confirmation with edit option */}
					{detectedAddress && !manualEntry && !editMode && (
						<div className='space-y-4'>
							<div className='bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3'>
								<div className='flex items-start justify-between'>
									<div className='flex items-start space-x-3 flex-1'>
										<MapPin className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium mb-2'>{t('location.detected')}</p>
											<div className='space-y-1 text-sm'>
												{formik.values.addressLine1 && (
													<p className='font-medium'>{formik.values.addressLine1}</p>
												)}
												{formik.values.addressLine2 && (
													<p className='text-muted-foreground'>{formik.values.addressLine2}</p>
												)}
												{formik.values.area && <p className='text-muted-foreground'>{formik.values.area}</p>}
												<p className='font-medium text-primary'>
													{formik.values.city}
													{formik.values.state && `, ${formik.values.state}`}
												</p>
												{formik.values.pincode && (
													<p className='text-muted-foreground'>{formik.values.pincode}</p>
												)}
											</div>
										</div>
									</div>
									<Button
										onClick={() => setEditMode(true)}
										variant='ghost'
										size='sm'
										className='flex-shrink-0 h-8 w-8 p-0 cursor-pointer'
									>
										<Edit2 className='w-4 h-4' />
									</Button>
								</div>
							</div>

							<div className='flex gap-3'>
								<Button onClick={confirmLocation} className='flex-1 h-12 text-base cursor-pointer'>
									{t('location.confirm')}
								</Button>
								<Button
									onClick={() => {
										setDetectedAddress(null)
										setManualEntry(true)
										formik.resetForm()
									}}
									variant='outline'
									className='h-12 px-4 cursor-pointer'
								>
									<X className='w-5 h-5' />
								</Button>
							</div>
						</div>
					)}

					{/* Edit mode or Manual entry */}
					{(manualEntry || editMode) && (
						<div className='space-y-4'>
							<div className='space-y-3'>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>{t('location.addressLine1')}</label>
									<Input
										name='addressLine1'
										value={formik.values.addressLine1}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder={t('location.addressLine1Placeholder')}
										className='h-11 text-base'
									/>
									{formik.touched.addressLine1 && formik.errors.addressLine1 && (
										<p className='text-xs text-destructive mt-1'>{formik.errors.addressLine1}</p>
									)}
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>{t('location.addressLine2')}</label>
									<Input
										name='addressLine2'
										value={formik.values.addressLine2}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder={t('location.addressLine2Placeholder')}
										className='h-11 text-base'
									/>
									{formik.touched.addressLine2 && formik.errors.addressLine2 && (
										<p className='text-xs text-destructive mt-1'>{formik.errors.addressLine2}</p>
									)}
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										{t('location.areaLabel')} <span className='text-destructive'>*</span>
									</label>
									<Input
										name='area'
										value={formik.values.area}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder={t('location.areaPlaceholder')}
										className='h-11 text-base'
									/>
									{formik.touched.area && formik.errors.area && (
										<p className='text-xs text-destructive mt-1'>{formik.errors.area}</p>
									)}
								</div>

								<div className='grid grid-cols-2 gap-3'>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											{t('location.cityLabel')} <span className='text-destructive'>*</span>
										</label>
										<Input
											name='city'
											value={formik.values.city}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											placeholder={t('location.cityPlaceholder')}
											className='h-11 text-base'
										/>
										{formik.touched.city && formik.errors.city && (
											<p className='text-xs text-destructive mt-1'>{formik.errors.city}</p>
										)}
									</div>

									<div className='space-y-2'>
										<label className='text-sm font-medium'>{t('location.pincodeLabel')}</label>
										<Input
											name='pincode'
											value={formik.values.pincode}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											placeholder={t('location.pincodePlaceholder')}
											className='h-11 text-base'
											maxLength={6}
										/>
										{formik.touched.pincode && formik.errors.pincode && (
											<p className='text-xs text-destructive mt-1'>{formik.errors.pincode}</p>
										)}
									</div>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>{t('location.stateLabel')}</label>
									<Input
										name='state'
										value={formik.values.state}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder={t('location.statePlaceholder')}
										className='h-11 text-base'
									/>
									{formik.touched.state && formik.errors.state && (
										<p className='text-xs text-destructive mt-1'>{formik.errors.state}</p>
									)}
								</div>
							</div>

							{error && (
								<div className='bg-destructive/10 border border-destructive/20 rounded-lg p-3'>
									<p className='text-sm text-destructive'>{error}</p>
								</div>
							)}

							<div className='flex gap-3'>
								<Button
									onClick={submitManualLocation}
									className='flex-1 h-12 text-base cursor-pointer'
								>
									<Check className='w-5 h-5 mr-2' />
									{t('location.continue')}
								</Button>

								{editMode && detectedAddress && (
									<Button
										onClick={() => {
											setEditMode(false)
											formik.setValues({
												addressLine1: detectedAddress.addressLine1,
												addressLine2: detectedAddress.addressLine2,
												area: detectedAddress.area,
												city: detectedAddress.city,
												state: detectedAddress.state,
												pincode: detectedAddress.pincode,
											})
										}}
										variant='outline'
										className='h-12 px-4 cursor-pointer'
									>
										<X className='w-5 h-5' />
									</Button>
								)}
							</div>

							{!detectedAddress && manualEntry && (
								<Button
									onClick={() => {
										setManualEntry(false)
										formik.resetForm()
										setError('')
									}}
									variant='ghost'
									className='w-full cursor-pointer'
								>
									{t('location.tryAutoAgain')}
								</Button>
							)}
						</div>
					)}

					{error && !manualEntry && !editMode && (
						<div className='bg-destructive/10 border border-destructive/20 rounded-lg p-3'>
							<p className='text-sm text-destructive'>{error}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
