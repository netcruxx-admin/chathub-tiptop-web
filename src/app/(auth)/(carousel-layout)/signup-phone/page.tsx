'use client'

import BackBtn from '@/components/backBtn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { NumberValidation } from '@/lib/validation/authValidation'
import { Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function NumberInput() {
	const router = useRouter()
	const t = useTranslations()

	const initialValues = {
		phoneNumber: '',
	}
	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div className='w-full'>
				<div className='mb-6'>
					<BackBtn />
					<h2 className='text-2xl font-bold mb-2'>{t('phone.title')}</h2>
					<p className='text-muted-foreground'>{t('phone.subtitle')}</p>
				</div>

				<Formik
					initialValues={initialValues}
					validationSchema={NumberValidation}
					validateOnMount={true}
					onSubmit={values => {
						console.log(values)
						router.push(`/signup-otp?number=${values.phoneNumber}`)
					}}
				>
					{props => (
						<form onSubmit={props.handleSubmit} className='space-y-4'>
							<div>
								<label className='block text-sm font-medium mb-2'>
									{t('phone.placeholder')}
								</label>
								<input
									type='tel'
									name='phoneNumber'
									value={props.values.phoneNumber}
									onChange={props.handleChange}
									onBlur={props.handleBlur}
									placeholder='9876543210'
									className={cn(
										'w-full h-12 px-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg',
										props.touched.phoneNumber &&
											props.errors.phoneNumber &&
											'border-red-400 focus:ring-red-500'
									)}
									maxLength={10}
								/>
							</div>
							{props.touched.phoneNumber && props.errors.phoneNumber && (
								<p className='text-red-500'>{props.errors.phoneNumber}</p>
							)}
							<Button
								type='submit'
								disabled={props.values.phoneNumber.length !== 10}
								className='w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl shadow-lg'
							>
								{t('phone.sendOTP')}
							</Button>
						</form>
					)}
				</Formik>
			</div>
		</div>
	)
}
