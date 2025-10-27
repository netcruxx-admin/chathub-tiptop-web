'use client'

import { Button } from '@/components/ui/button'
import { Mic, FileText, Upload, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FlowSelection() {
	const router = useRouter()

	const handleFlowSelection = (flow: 'voice' | 'form' | 'resume') => {
		// Store the selected flow
		localStorage.setItem('onboardingFlow', flow)

		if (flow === 'voice') {
			router.push('/voice-bot-intro')
		} else if (flow === 'form') {
			router.push('/form-based-profile')
		} else if (flow === 'resume') {
			router.push('/resume-upload')
		}
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
					className='mr-2'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<div>
					<h1 className='text-lg font-semibold'>
						How would you like to proceed?
					</h1>
					<p className='text-xs text-muted-foreground'>
						Choose your preferred method
					</p>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-4 sm:p-6'>
				<div className='max-w-2xl mx-auto space-y-3'>
					{/* Voice-Assisted Flow */}
					<button
						onClick={() => handleFlowSelection('voice')}
						className='w-full p-3 sm:p-4 border-2 border-primary bg-primary/5 rounded-xl text-left hover:bg-primary/10 transition-colors relative group'
					>
						<div className='absolute top-2 right-2 sm:top-3 sm:right-3'>
							<span className='text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded-full'>
								Recommended
							</span>
						</div>
						<div className='flex items-start gap-3'>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md'>
								<Mic className='w-5 h-5 text-white' />
							</div>
							<div className='flex-1 pt-0.5'>
								<h3 className='font-semibold text-base sm:text-lg mb-1'>
									Voice Assistant
								</h3>
								<p className='text-sm sm:text-base text-muted-foreground'>
									Talk to complete your profile
								</p>
							</div>
						</div>
					</button>

					{/* Form-Assisted Flow */}
					<button
						onClick={() => handleFlowSelection('form')}
						className='w-full p-3 sm:p-4 border-2 border-border rounded-xl text-left hover:bg-accent transition-colors group'
					>
						<div className='flex items-start gap-3'>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md'>
								<FileText className='w-5 h-5 text-white' />
							</div>
							<div className='flex-1 pt-0.5'>
								<h3 className='font-semibold text-base sm:text-lg mb-1'>
									Fill Form
								</h3>
								<p className='text-sm sm:text-base text-muted-foreground'>
									Fill a simple form
								</p>
							</div>
						</div>
					</button>

					{/* Resume Parsing Flow */}
					<button
						onClick={() => handleFlowSelection('resume')}
						className='w-full p-3 sm:p-4 border-2 border-border rounded-xl text-left hover:bg-accent transition-colors group'
					>
						<div className='flex items-start gap-3'>
							<div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md'>
								<Upload className='w-5 h-5 text-white' />
							</div>
							<div className='flex-1 pt-0.5'>
								<h3 className='font-semibold text-base sm:text-lg mb-1'>
									Upload Resume
								</h3>
								<p className='text-sm sm:text-base text-muted-foreground'>
									Upload your resume
								</p>
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	)
}
