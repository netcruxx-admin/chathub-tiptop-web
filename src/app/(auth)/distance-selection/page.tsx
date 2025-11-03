'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, MapPin, Info, Loader2 } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useDispatch, useSelector } from 'react-redux'
import { setJobDistance } from '@/redux/slices/authSlice'
// import { useUpdateProfileMutation } from '@/redux/apis/authApi'
import { RootState } from '@/redux/store'
import { toast } from 'sonner'

export default function DistanceSelection() {
	const t = useTranslations()
	const router = useRouter()
	const dispatch = useDispatch()
	const [jobRadius, setJobRadius] = useState(15)
	const user = useSelector((state: RootState) => state.auth.user)
	// const [updateProfile, { isLoading }] = useUpdateProfileMutation()

	const handleComplete = async () => {
		try {
			dispatch(setJobDistance(jobRadius.toString()))
			// Save distance preference to localStorage
			localStorage.setItem('jobRadius', jobRadius.toString())

			// Call updateProfile mutation
			// await updateProfile({
			// 	ID: user.ID,
			// 	FirstName: user.FirstName,
			// 	LastName: user.LastName,
			// 	Email: user.Email,
			// 	Phone: user.Phone,
			// 	MiddleName: user.MiddleName,
			// 	Title: user.Title,
			// 	AlternateEmail: user.AlternateEmail,
			// 	DOB: user.DOB,
			// 	Sex: user.Sex,
			// 	BirthPlace: user.BirthPlace,
			// 	Marital: user.Marital,
			// 	FatherName: user.FatherName,
			// 	MotherName: user.MotherName,
			// 	EmergencyPhone: user.EmergencyPhone,
			// 	Address1: user.Address1,
			// 	Address2: user.Address2,
			// 	City: user.City,
			// 	StateID: user.StateID,
			// 	CountryID: user.CountryID,
			// 	Zip: user.Zip,
			// 	PermanetAddress1: user.PermanetAddress1,
			// 	PermanetAddress2: user.PermanetAddress2,
			// 	PermanetCity: user.PermanetCity,
			// 	PermanetStateID: user.PermanetStateID,
			// 	PermanetCountryID: user.PermanetCountryID,
			// 	PermanetZip: user.PermanetZip,
			// 	PoliceStation: user.PoliceStation,
			// 	SecretQuestion: user.SecretQuestion,
			// 	SecretAnswer: user.SecretAnswer,
			// 	TimeZone: user.TimeZone,
			// 	GovtID: user.GovtID,
			// 	PanNumber: user.PanNumber,
			// 	VoterID: user.VoterID,
			// 	PrimaryContact: user.PrimaryContact,
			// 	ImagePath: user.ImagePath,
			// 	State: user.State,
			// 	Country: user.Country,
			// 	PublicProfile: user.PublicProfile,
			// 	IsPersonalInfoAvailable: user.IsPersonalInfoAvailable,
			// 	IsQualificationInfoAvailable: user.IsQualificationInfoAvailable,
			// 	IsExperienceInfoAvailable: user.IsExperienceInfoAvailable,
			// 	IsFamilyInfoAvailable: user.IsFamilyInfoAvailable,
			// 	IsAdditionalInfoAvailable: user.IsAdditionalInfoAvailable,
			// 	IsReferenceInfoAvailable: user.IsReferenceInfoAvailable,
			// 	BloodGroup: user.BloodGroup,
			// }).unwrap()

			toast.success(t('distance.updateSuccess'))
			// Navigate to job board or profile completion
			router.push('/dashboard')
		} catch (error: any) {
			toast.error(error?.data?.message || t('distance.updateError'))
			router.push('/dashboard')
		}
	}

	const currentProgress = 80

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b'>
				<div className='flex items-center mb-3'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => router.back()}
						className='mr-2 cursor-pointer'
					>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<div className='flex-1'>
						<h1 className='text-lg font-semibold'>{t('common.continue')}</h1>
						<p className='text-xs text-muted-foreground'>
							{t('distance.step')}
						</p>
					</div>
				</div>
				<ProgressBar
					progress={currentProgress}
					label={t('distance.profileProgress')}
				/>
			</div>

			<div className='flex-1 overflow-y-auto p-4'>
				<div className='max-w-2xl mx-auto'>
					<div className='space-y-6'>
						<div>
							<h2 className='text-xl font-semibold mb-2'>
								{t('distance.title')}
							</h2>
							<p className='text-sm text-muted-foreground mb-6'>
								{t('distance.subtitle')}
							</p>
						</div>

						<div className='bg-muted/50 rounded-2xl p-6 space-y-6'>
							<div className='text-center'>
								<div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-3 shadow-lg'>
									<MapPin className='w-10 h-10 text-white' />
								</div>
								<div className='text-4xl font-bold text-primary mb-1'>
									{jobRadius} km
								</div>
								<p className='text-sm text-muted-foreground'>
									{t('distance.radiusLabel')}
								</p>
							</div>

							<div className='space-y-3'>
								<input
									type='range'
									min='5'
									max='50'
									step='5'
									value={jobRadius}
									onChange={e => setJobRadius(Number.parseInt(e.target.value))}
									className='w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary'
								/>
								<div className='flex items-center justify-between text-xs text-muted-foreground'>
									<span>{t('distance.minRange')}</span>
									<span>{t('distance.midRange')}</span>
									<span>{t('distance.maxRange')}</span>
								</div>
							</div>
						</div>

						<div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4'>
							<div className='flex items-start space-x-3'>
								<Info className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
								<div className='text-sm text-blue-900 dark:text-blue-100'>
									<p className='font-medium mb-1'>{t('distance.infoTitle')}</p>
									<p className='text-blue-700 dark:text-blue-300'>
										{t('distance.infoDesc')}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='p-4 border-t'>
				<div className='max-w-2xl mx-auto'>
					<Button
						onClick={handleComplete}
						// disabled={isLoading}
						className='w-full h-12 cursor-pointer'
					>
						{/* {isLoading ? (
							<>
								<Loader2 className='w-4 h-4 mr-2 animate-spin' />
								{t('common.loading')}
							</>
						) : (
							<>
								{t('distance.browseJobs')}
								<ArrowRight className='w-4 h-4 ml-2' />
							</>
						)} */}
					</Button>
				</div>
			</div>
		</div>
	)
}
