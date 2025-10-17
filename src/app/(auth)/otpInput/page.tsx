'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import OtpInput from 'react-otp-input'

export default function OTPInput() {
	const router = useRouter()
	const [otp, setOtp] = useState('')
	const searchParams = useSearchParams()
	const phoneNumber = searchParams.get('number')

	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div>
				<div className='mb-6'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => router.back()}
						className='mb-4 -ml-2'
					>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Back
					</Button>
					<h2 className='text-2xl font-bold mb-2'>
						Verification code enter karein
					</h2>
					<p className='text-muted-foreground'>
						OTP bheja gaya hai {phoneNumber}
					</p>
				</div>
				<form
					className='space-y-6'
					onSubmit={e => {
						e.preventDefault()
						router.push('/confirmLanguage')
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
					<Button
						// onClick={() => setCurrentScreen("languageConfirmation")}
						disabled={otp.length < 6}
						className='w-full h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-xl'
					>
						<Check className='w-5 h-5 mr-2' />
						Verify & Continue
					</Button>

					<button className='w-full text-sm text-primary hover:underline'>
						OTP dobara bhejein
					</button>
				</form>
			</div>
		</div>
	)
}
