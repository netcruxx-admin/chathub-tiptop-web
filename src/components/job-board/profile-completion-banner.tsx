'use client'

import { Button } from '@/components/ui/button'
// import { useApp } from "@/lib/context/app-context"
// import { calculateProfileCompletion } from "@/lib/utils/profile-completion"
import * as Icons from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export function ProfileCompletionBanner() {
	// const { phoneNumber, username, email, stageAData, stageBData, stageCData, setCurrentScreen } = useApp()
	const t = useTranslations()
	const [isDismissed, setIsDismissed] = useState(false)

	// const completion = calculateProfileCompletion(phoneNumber, username, email, stageAData, stageBData, stageCData)

	// Check if banner was dismissed in this session
	useEffect(() => {
		const dismissed = sessionStorage.getItem('profileBannerDismissed')
		if (dismissed === 'true') {
			setIsDismissed(true)
		}
	}, [])

	const handleDismiss = () => {
		setIsDismissed(true)
		sessionStorage.setItem('profileBannerDismissed', 'true')
	}

	const handleCompleteProfile = () => {
		// setCurrentScreen("profile")
	}

	// Don't show if profile is >= 70% or if dismissed
	// if (completion >= 70 || isDismissed) {
	//   return null
	// }

	// Calculate how many more jobs they could unlock
	// const additionalJobs = Math.floor((70 - completion) / 5) * 2 + 5

	return (
		<div className='bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 mb-4'>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex-1'>
					<div className='flex items-center gap-2 mb-2'>
						<Icons.AlertCircle className='w-5 h-5 text-orange-600' />
						<h3 className='font-semibold text-orange-900'>
							{'Complete Your Profile'} 
              {/* ({completion}%) */}
						</h3>
					</div>
					<p className='text-sm text-orange-800 mb-3'>
						{/* {`Unlock ${additionalJobs} more jobs by completing your profile. Takes only 5 minutes!`} */}
					</p>
					<div className='flex items-center gap-2'>
						<Button
							onClick={handleCompleteProfile}
							size='sm'
							className='bg-orange-600 hover:bg-orange-700'
						>
							{'Complete Now'}
							<Icons.ArrowRight className='w-4 h-4 ml-1' />
						</Button>
						<Button
							onClick={handleDismiss}
							size='sm'
							variant='ghost'
							className='text-orange-700'
						>
							{'Dismiss'}
						</Button>
					</div>
				</div>
				<button
					onClick={handleDismiss}
					className='text-orange-600 hover:text-orange-800'
				>
					<Icons.X className='w-5 h-5' />
				</button>
			</div>
		</div>
	)
}
