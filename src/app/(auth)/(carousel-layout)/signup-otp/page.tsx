'use client'

import BackBtn from '@/components/BackBtn'
import { Button } from '@/components/ui/button'
import { Check, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import OtpInput from 'react-otp-input'
import {
	useVerifyCodeMutation,
	useSendVerificationCodeMutation,
} from '@/redux/apis/authApi'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useFormik } from 'formik'
import { createOTPValidation } from '@/lib/validation/authValidation'
import { cn } from '@/lib/cn'

export default function SignupOTP() {
	const router = useRouter()
	const t = useTranslations()
	const [resendTimer, setResendTimer] = useState(30) // 30 seconds countdown
	const [canResend, setCanResend] = useState(false)

	// Read from Redux store with fallback to URL params
	const phoneNumber = useSelector((state: RootState) => state.auth.user.Phone)
	const senderId = useSelector((state: RootState) => state.auth.senderId)

	// Prefetch the next page to reduce loading time
	useEffect(() => {
		router.prefetch('/signup-language')
	}, [router])

	const [verifyCode] = useVerifyCodeMutation()
	const [sendVerificationCode, { isLoading: isResending }] =
		useSendVerificationCodeMutation()

	const formik = useFormik({
		initialValues: {
			otp: '',
		},
		validationSchema: createOTPValidation(t),
		validateOnMount: true,
		onSubmit: async values => {
			if (!phoneNumber) {
				toast.error(t('otp.phoneMissing'))
				return
			}

			try {
				const response = await verifyCode({
					phoneNumber,
					otp: values.otp,
					senderId,
				}).unwrap()

				console.log('OTP verified successfully:', response)

				// Validate response
				if (response && !response.Result) {
					toast.error(t('otp.invalidCode'))
				} else {
					// Show success toast
					toast.success(t('otp.verifySuccess'))
				}
			} catch (err: any) {
				console.error('Failed to verify OTP:', err)
				const errorMessage = err?.data?.message || t('otp.verifyError')
				toast.error(errorMessage)
			}
			//! API BYPASS
			router.push('/signup-language')
		},
	})

	// Timer countdown effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (resendTimer > 0 && !canResend) {
			interval = setInterval(() => {
				setResendTimer(prev => {
					if (prev <= 1) {
						setCanResend(true)
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [resendTimer, canResend])

	const handleResendOTP = async () => {
		if (!phoneNumber || isResending || !canResend) return

		try {
			await sendVerificationCode({ phoneNumber }).unwrap()
			formik.setFieldValue('otp', '')

			// Reset timer
			setResendTimer(30)
			setCanResend(false)

			// Show success toast
			toast.success(t('otp.resendSuccess'))
		} catch (err: any) {
			console.error('Failed to resend OTP:', err)
			const errorMessage = err?.data?.message || t('otp.resendError')
			toast.error(errorMessage)
		}
	}

	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div className='w-full'>
				<div className='mb-6'>
					<div className='mb-4'>
						<BackBtn />
					</div>
					<h2 className='text-2xl font-bold mb-2'>{t('otp.title')}</h2>
					<p className='text-muted-foreground'>
						{t('otp.subtitle')} {phoneNumber}
					</p>
				</div>

				<form onSubmit={formik.handleSubmit} className='space-y-6'>
					<div className='w-full'>
						<OtpInput
							value={formik.values.otp}
							onChange={value => formik.setFieldValue('otp', value)}
							numInputs={6}
							shouldAutoFocus={true}
							containerStyle='w-full flex justify-evenly'
							skipDefaultStyles={true}
							inputStyle={cn(
								'w-12 h-14 text-2xl text-center text-foreground border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
								formik.touched.otp &&
									formik.errors.otp &&
									'border-red-400 focus:ring-red-500'
							)}
							renderInput={(props, id) => (
								<input
									id={`otp${id}`}
									name='otp'
									{...props}
									onBlur={formik.handleBlur}
								/>
							)}
						/>
					</div>
					{formik.touched.otp && formik.errors.otp && (
						<p className='text-red-500 text-sm text-center'>{formik.errors.otp}</p>
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
							<>
								<Check className='w-5 h-5 mr-2' />
								{t('otp.verify')}
							</>
						)}
					</Button>

					<button
						type='button'
						onClick={handleResendOTP}
						disabled={isResending || !canResend}
						className='w-full text-sm text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isResending
							? t('otp.sending')
							: canResend
							? t('otp.resend')
							: `${t('otp.resend')} ${t('otp.in')} ${resendTimer}${t(
									'otp.seconds'
							  )}`}
					</button>
				</form>
			</div>
		</div>
	)
}
