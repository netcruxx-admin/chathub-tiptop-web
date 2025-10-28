'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2, Navigation, X, Edit2, Check } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { updateUser } from '@/redux/slices/authSlice'

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
	const dispatch = useDispatch()
	const [detecting, setDetecting] = useState(false)
	const [detectedAddress, setDetectedAddress] =
		useState<DetailedAddress | null>(null)
	const [manualEntry, setManualEntry] = useState(false)
	const [editMode, setEditMode] = useState(false)
	const [addressForm, setAddressForm] = useState<DetailedAddress>({
		addressLine1: '',
		addressLine2: '',
		area: '',
		city: '',
		state: '',
		pincode: '',
	})
	const [error, setError] = useState('')

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
						city:
							addr.city ||
							addr.town ||
							addr.village ||
							addr.state_district ||
							'',
						state: addr.state || '',
						pincode: addr.postcode || '',
						latitude,
						longitude,
					}

					setDetectedAddress(detectedAddr)
					setAddressForm(detectedAddr)
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
		const fullAddress = [
			addressForm.addressLine1,
			addressForm.addressLine2,
			addressForm.area,
			addressForm.city,
			addressForm.state,
			addressForm.pincode,
		]
			.filter(Boolean)
			.join(', ')

		dispatch(
			updateUser({
				Address1: addressForm.addressLine1,
				Address2: addressForm.addressLine2,
				Area: addressForm.area,
				City: addressForm.city,
				State: addressForm.state,
				Zip: addressForm.pincode
			})
		)

		// Save to localStorage
		localStorage.setItem(
			'locationData',
			JSON.stringify({
				permanentAddress: fullAddress,
				addressLine1: addressForm.addressLine1,
				addressLine2: addressForm.addressLine2,
				area: addressForm.area,
				city: addressForm.city,
				state: addressForm.state,
				pincode: addressForm.pincode,
				latitude: addressForm.latitude || detectedAddress?.latitude,
				longitude: addressForm.longitude || detectedAddress?.longitude,
			})
		)

		// Navigate to next page (distance selection or completion)
		router.push('/distance-selection')
	}

	const validateAddress = () => {
		if (!addressForm.area.trim() || !addressForm.city.trim()) {
			setError(t('location.enterAreaCity'))
			return false
		}
		return true
	}

	const submitManualLocation = () => {
		if (!validateAddress()) return
		confirmLocation()
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
						<p className='text-sm text-muted-foreground'>
							{t('location.subtitle')}
						</p>
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
									<span className='bg-background px-2 text-muted-foreground'>
										{t('location.or')}
									</span>
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
											<p className='text-sm font-medium mb-2'>
												{t('location.detected')}
											</p>
											<div className='space-y-1 text-sm'>
												{addressForm.addressLine1 && (
													<p className='font-medium'>
														{addressForm.addressLine1}
													</p>
												)}
												{addressForm.addressLine2 && (
													<p className='text-muted-foreground'>
														{addressForm.addressLine2}
													</p>
												)}
												{addressForm.area && (
													<p className='text-muted-foreground'>
														{addressForm.area}
													</p>
												)}
												<p className='font-medium text-primary'>
													{addressForm.city}
													{addressForm.state && `, ${addressForm.state}`}
												</p>
												{addressForm.pincode && (
													<p className='text-muted-foreground'>
														{addressForm.pincode}
													</p>
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
								<Button
									onClick={confirmLocation}
									className='flex-1 h-12 text-base cursor-pointer'
								>
									{t('location.confirm')}
								</Button>
								<Button
									onClick={() => {
										setDetectedAddress(null)
										setManualEntry(true)
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
									<label className='text-sm font-medium'>
										{t('location.addressLine1')}
									</label>
									<Input
										value={addressForm.addressLine1}
										onChange={e => {
											setAddressForm({
												...addressForm,
												addressLine1: e.target.value,
											})
											setError('')
										}}
										placeholder={t('location.addressLine1Placeholder')}
										className='h-11 text-base'
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										{t('location.addressLine2')}
									</label>
									<Input
										value={addressForm.addressLine2}
										onChange={e => {
											setAddressForm({
												...addressForm,
												addressLine2: e.target.value,
											})
											setError('')
										}}
										placeholder={t('location.addressLine2Placeholder')}
										className='h-11 text-base'
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										{t('location.areaLabel')}{' '}
										<span className='text-destructive'>*</span>
									</label>
									<Input
										value={addressForm.area}
										onChange={e => {
											setAddressForm({ ...addressForm, area: e.target.value })
											setError('')
										}}
										placeholder={t('location.areaPlaceholder')}
										className='h-11 text-base'
									/>
								</div>

								<div className='grid grid-cols-2 gap-3'>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											{t('location.cityLabel')}{' '}
											<span className='text-destructive'>*</span>
										</label>
										<Input
											value={addressForm.city}
											onChange={e => {
												setAddressForm({ ...addressForm, city: e.target.value })
												setError('')
											}}
											placeholder={t('location.cityPlaceholder')}
											className='h-11 text-base'
										/>
									</div>

									<div className='space-y-2'>
										<label className='text-sm font-medium'>
											{t('location.pincodeLabel')}
										</label>
										<Input
											value={addressForm.pincode}
											onChange={e => {
												setAddressForm({
													...addressForm,
													pincode: e.target.value,
												})
												setError('')
											}}
											placeholder={t('location.pincodePlaceholder')}
											className='h-11 text-base'
											maxLength={6}
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										{t('location.stateLabel')}
									</label>
									<Input
										value={addressForm.state}
										onChange={e => {
											setAddressForm({ ...addressForm, state: e.target.value })
											setError('')
										}}
										placeholder={t('location.statePlaceholder')}
										className='h-11 text-base'
									/>
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

								{editMode && (
									<Button
										onClick={() => {
											setEditMode(false)
											setAddressForm(detectedAddress!)
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
										setAddressForm({
											addressLine1: '',
											addressLine2: '',
											area: '',
											city: '',
											state: '',
											pincode: '',
										})
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
