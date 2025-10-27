'use client'

import BackBtn from '@/components/backBtn'
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

export default function OTPInput() {
	const router = useRouter()
	const t = useTranslations()
	const [otp, setOtp] = useState('')
	const [error, setError] = useState('')
	const [resendTimer, setResendTimer] = useState(30) // 30 seconds countdown
	const [canResend, setCanResend] = useState(false)

	// Read from Redux store with fallback to URL params
	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber)
	const senderId = useSelector((state: RootState) => state.auth.senderId)

	const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation()
	const [sendVerificationCode, { isLoading: isResending }] =
		useSendVerificationCodeMutation()

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
				<form
					className='space-y-6'
					onSubmit={async e => {
						e.preventDefault()
						if (!phoneNumber) {
							setError('Phone number is missing')
							return
						}

						try {
							setError('')
							const response = await verifyCode({
								phoneNumber,
								otp: otp,
								senderId,
							}).unwrap()

							console.log('OTP verified successfully:', response)

							// Validate response
							if (response && !response.Result) {
								toast.error('Please enter a valid 6-digit code.')
							} else {
								// Show success toast
								toast.success('OTP verified successfully!')
								setResendTimer(30)
								// Navigate to language selection
								router.push('/signup-language')
							}
						} catch (err: any) {
							console.error('Failed to verify OTP:', err)
							const errorMessage =
								err?.data?.message || 'Invalid OTP. Please try again.'
							setError(errorMessage)
							toast.error(errorMessage)
						}
					}}
				>
					<div className='w-full'>
						<OtpInput
							value={otp}
							onChange={setOtp}
							numInputs={6}
							shouldAutoFocus={true}
							containerStyle='w-full flex justify-evenly'
							skipDefaultStyles={true}
							inputStyle='w-12 h-14 text-2xl text-center text-foreground border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
							renderInput={(props, id) => (
								<input id={`otp${id}`} name={`otp${id}`} {...props} />
							)}
						/>
					</div>
					{error && <p className='text-red-500 text-sm text-center'>{error}</p>}

					<Button
						type='submit'
						disabled={otp.length < 6 || isVerifying}
						className='w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl cursor-pointer'
					>
						{isVerifying ? (
							<>
								<Loader2 className='w-5 h-5 mr-2 animate-spin' />
								{t('phone.verifying')}
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
						onClick={async () => {
							if (!phoneNumber || isResending || !canResend) return

							try {
								setError('')
								// API call commented out
								// await sendVerificationCode({ phoneNumber }).unwrap()
								setOtp('')

								// Reset timer
								setResendTimer(30)
								setCanResend(false)

								// Show success toast
								toast.success('OTP resent successfully!')
							} catch (err: any) {
								console.error('Failed to resend OTP:', err)
								const errorMessage =
									err?.data?.message || 'Failed to resend OTP.'
								setError(errorMessage)
								toast.error(errorMessage)
							}
						}}
						disabled={isResending || !canResend}
						className='w-full text-sm text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isResending
							? 'Sending...'
							: canResend
							? t('otp.resend')
							: `${t('otp.resend')} in ${resendTimer}s`}
					</button>
				</form>
			</div>
		</div>
	)
}
