'use client'

import BackBtn from '@/components/backBtn'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import OtpInput from 'react-otp-input'

export default function OTPInput() {
	const router = useRouter()
	const t = useTranslations()
	const [otp, setOtp] = useState('')
	const searchParams = useSearchParams()
	const phoneNumber = searchParams.get('number')

	return (
		<div className='flex flex-col justify-center items-center p-8 w-full h-full flex-1'>
			<div className='w-full'>
				<div className='mb-6'>
					<BackBtn />
					<h2 className='text-2xl font-bold mb-2'>{t('otp.title')}</h2>
					<p className='text-muted-foreground'>
						{t('otp.subtitle')} {phoneNumber}
					</p>
				</div>
				<form
					className='space-y-6'
					onSubmit={e => {
						e.preventDefault()
						router.push('/signup-language')
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
						{t('otp.verify')}
					</Button>

					<button className='w-full text-sm text-primary hover:underline'>
						{t('otp.resend')}
					</button>
				</form>
			</div>
		</div>
	)
}
