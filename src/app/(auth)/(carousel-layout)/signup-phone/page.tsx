'use client'

import BackBtn from '@/components/BackBtn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { createNumberValidation } from '@/lib/validation/authValidation'
import { useFormik } from 'formik'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSendVerificationCodeMutation } from '@/redux/apis/authApi'
import { useDispatch } from 'react-redux'
import { setSenderId, updateUser } from '@/redux/slices/authSlice'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function SignupPhone() {
	const router = useRouter()
	const t = useTranslations()
	const dispatch = useDispatch()
	const [sendVerificationCode] = useSendVerificationCodeMutation()

	const formik = useFormik({
		initialValues: {
			phoneNumber: '',
		},
		validationSchema: createNumberValidation(t),
		validateOnMount: true,
		onSubmit: async values => {
			try {
				const response = await sendVerificationCode({
					phoneNumber: values.phoneNumber,
				}).unwrap()
				console.log('response', response)

				dispatch(updateUser({ Phone: values.phoneNumber }))
				dispatch(setSenderId(response.Result))

				toast.success(t('phone.otpSent'))
			} catch (err: any) {
				console.error('Failed to send OTP:', err)
				const errorMessage =
				err?.data?.message || t('phone.otpError') || 'Failed to send OTP. Please try again.'
				toast.error(errorMessage)
			}
			//! API BYPASS
			router.push('/signup-otp')
		},
	})
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

				<form onSubmit={formik.handleSubmit} className='space-y-4'>
					<div>
						<label htmlFor='phoneNumber' className='block text-sm font-medium mb-2'>
							{t('phone.placeholder')}
						</label>
						<input
							id='phoneNumber'
							type='tel'
							name='phoneNumber'
							value={formik.values.phoneNumber}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder='9876543210'
							className={cn(
								'w-full h-12 px-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg',
								formik.touched.phoneNumber &&
									formik.errors.phoneNumber &&
									'border-red-400 focus:ring-red-500'
							)}
							maxLength={10}
						/>
					</div>
					{formik.touched.phoneNumber && formik.errors.phoneNumber && (
						<p className='text-red-500 text-sm mt-1'>{formik.errors.phoneNumber}</p>
					)}
					<Button
						type='submit'
						variant='auth'
						disabled={!formik.isValid || formik.isSubmitting}
						className='w-full h-12'
					>
						{formik.isSubmitting ? (
							<>
								<Loader2 className='w-5 h-5 mr-2 animate-spin' />
								{/* {t('phone.verifying')} */}
							</>
						) : (
							t('phone.sendOTP')
						)}
					</Button>
				</form>
			</div>
		</div>
	)
}
