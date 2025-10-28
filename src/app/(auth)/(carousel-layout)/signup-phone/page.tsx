'use client'

import BackBtn from '@/components/backBtn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { createNumberValidation } from '@/lib/validation/authValidation'
import { Formik } from 'formik'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSendVerificationCodeMutation } from '@/redux/apis/authApi'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setPhoneNumber, setSenderId, updateUser } from '@/redux/slices/authSlice'

export default function NumberInput() {
	const router = useRouter()
	const t = useTranslations()
	const dispatch = useDispatch()
	const [sendVerificationCode, { isLoading }] =
		useSendVerificationCodeMutation()
	const [error, setError] = useState('')

	const initialValues = {
		phoneNumber: '',
	}
	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div className='w-full'>
				<div className='mb-6'>
					<div className='mb-4'>
						<BackBtn />
					</div>
					<h2 className='text-2xl font-bold mb-2'>{t('phone.title')}</h2>
					<p className='text-muted-foreground'>{t('phone.subtitle')}</p>
				</div>

				<Formik
					initialValues={initialValues}
					validationSchema={createNumberValidation(t)}
					validateOnMount={true}
					onSubmit={async values => {
						try {
							setError('')
							const response = await sendVerificationCode({
								phoneNumber: values.phoneNumber,
							}).unwrap()
							console.log('response', response)
							// if (response && response.Status === 0) {
								// dispatch(setPhoneNumber(values.phoneNumber))
								dispatch(updateUser({Phone: values.phoneNumber}))
								dispatch(setSenderId(response.Result))
								// Navigate to OTP page
							// router.push(`/signup-otp?number=${values.phoneNumber}`)
							// }

							// Save phone number to Redux
							router.push(`/signup-otp`)

							
						} catch (err: any) {
							console.error('Failed to send OTP:', err)
							setError(
								err?.data?.message || 'Failed to send OTP. Please try again.'
							)
						}
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
							{error && <p className='text-red-500 text-sm'>{error}</p>}
							<Button
								type='submit'
								disabled={props.values.phoneNumber.length !== 10 || isLoading}
								className='w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl shadow-lg cursor-pointer'
							>
								{isLoading ? t('phone.verifying') : t('phone.sendOTP')}
							</Button>
						</form>
					)}
				</Formik>
			</div>
		</div>
	)
}
