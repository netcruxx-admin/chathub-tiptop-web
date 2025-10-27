'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, MapPin, Info } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useFormik } from 'formik'
import { createDistanceSelectionValidation } from '@/lib/validation/authValidation'
import type { DistanceSelectionValidationValues } from '@/types/validation'

export default function DistanceSelection() {
	const t = useTranslations()
	const router = useRouter()

	const formik = useFormik<DistanceSelectionValidationValues>({
		initialValues: {
			jobRadius: 15,
		},
		validationSchema: createDistanceSelectionValidation(t),
		onSubmit: (values) => {
			// Save distance preference to localStorage
			localStorage.setItem('jobRadius', values.jobRadius.toString())

			// Navigate to job board or profile completion
			router.push('/job-board')
		},
	})

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
						<p className='text-xs text-muted-foreground'>Step 3 of 3</p>
					</div>
				</div>
				<ProgressBar progress={currentProgress} label='Profile Progress' />
			</div>

			<div className='flex-1 overflow-y-auto p-4'>
				<div className='max-w-2xl mx-auto'>
					<div className='space-y-6'>
						<div>
							<h2 className='text-xl font-semibold mb-2'>{t('distance.title')}</h2>
							<p className='text-sm text-muted-foreground mb-6'>{t('distance.subtitle')}</p>
						</div>

						<div className='bg-muted/50 rounded-2xl p-6 space-y-6'>
							<div className='text-center'>
								<div className='inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-3 shadow-lg'>
									<MapPin className='w-10 h-10 text-white' />
								</div>
								<div className='text-4xl font-bold text-primary mb-1'>{formik.values.jobRadius} km</div>
								<p className='text-sm text-muted-foreground'>{t('distance.radiusLabel')}</p>
							</div>

							<div className='space-y-3'>
								<input
									type='range'
									name='jobRadius'
									min='5'
									max='50'
									step='5'
									value={formik.values.jobRadius}
									onChange={e => formik.setFieldValue('jobRadius', Number.parseInt(e.target.value))}
									onBlur={formik.handleBlur}
									className='w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary'
								/>
								<div className='flex items-center justify-between text-xs text-muted-foreground'>
									<span>5 km</span>
									<span>25 km</span>
									<span>50 km</span>
								</div>
								{formik.touched.jobRadius && formik.errors.jobRadius && (
									<p className='text-xs text-destructive text-center'>{formik.errors.jobRadius}</p>
								)}
							</div>
						</div>

						<div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-4'>
							<div className='flex items-start space-x-3'>
								<Info className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
								<div className='text-sm text-blue-900 dark:text-blue-100'>
									<p className='font-medium mb-1'>{t('distance.infoTitle')}</p>
									<p className='text-blue-700 dark:text-blue-300'>{t('distance.infoDesc')}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='p-4 border-t'>
				<div className='max-w-2xl mx-auto'>
					<Button onClick={() => formik.handleSubmit()} disabled={!formik.isValid} className='w-full h-12 cursor-pointer'>
						{t('distance.browseJobs')}
						<ArrowRight className='w-4 h-4 ml-2' />
					</Button>
				</div>
			</div>
		</div>
	)
}
