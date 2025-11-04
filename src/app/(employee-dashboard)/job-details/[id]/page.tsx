'use client'

import { Button } from '@/components/ui/button'
import { useGetJobPostingByIdQuery } from '@/redux/apis/jobBoardApi'
import { ArrowLeft, Briefcase, MapPin, Calendar, Users, Loader2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { setShowStageBGate } from '@/redux/slices/jobsSlice'
import { calculateProfileCompletion } from '@/lib/utils/profile-completion'

export default function JobDetails() {
	const router = useRouter()
	const params = useParams()
	const dispatch = useAppDispatch()
	const jobId = params.id as string

	// Fetch job posting from API
	const { data: jobPosting, isLoading, error } = useGetJobPostingByIdQuery(jobId)

	// Get user data for profile completion check
	const stageAData = useAppSelector(state => state.jobs.stageAData)
	const stageBData = useAppSelector(state => state.jobs.stageBData)
	const stageCData = useAppSelector(state => state.jobs.stageCData)
	const phoneNumber = useAppSelector(state => state.auth.phoneNumber)
	const username = useAppSelector(state => state.auth.userName)
	const email = useAppSelector(state => state.auth.user.Email)

	const handleBack = () => {
		router.push('/dashboard')
	}

	const handleApply = () => {
		const completion = calculateProfileCompletion(
			phoneNumber || '',
			username || '',
			email || '',
			stageAData || ({} as any),
			stageBData || ({} as any),
			stageCData || ({} as any)
		)

		if (completion < 70) {
			dispatch(setShowStageBGate(true))
		} else {
			// TODO: Implement actual job application
			alert('Application submitted!')
		}
	}

	// Loading state
	if (isLoading) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<div className='flex flex-col items-center gap-3'>
					<Loader2 className='w-8 h-8 animate-spin text-primary' />
					<span className='text-muted-foreground'>Loading job details...</span>
				</div>
			</div>
		)
	}

	// Error state
	if (error || !jobPosting) {
		return (
			<div className='min-h-screen bg-background flex flex-col'>
				<div className='p-4 border-b flex items-center justify-between'>
					<div className='flex items-center'>
						<Button
							variant='ghost'
							size='icon'
							onClick={handleBack}
							className='mr-2'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<div>
							<h1 className='text-lg font-semibold'>Job Details</h1>
						</div>
					</div>
				</div>
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<p className='text-destructive text-lg font-semibold mb-2'>Failed to load job</p>
						<p className='text-muted-foreground mb-4'>
							The job you're looking for doesn't exist or couldn't be loaded.
						</p>
						<Button onClick={handleBack}>Go back to dashboard</Button>
					</div>
				</div>
			</div>
		)
	}

	// Render job posting
	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center justify-between'>
				<div className='flex items-center'>
					<Button
						variant='ghost'
						size='icon'
						onClick={handleBack}
						className='mr-2'
					>
						<ArrowLeft className='w-5 h-5' />
					</Button>
					<div>
						<h1 className='text-lg font-semibold'>Job Details</h1>
					</div>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-6'>
				<div className='max-w-md mx-auto space-y-6'>
					{/* Job Header */}
					<div className='bg-card rounded-xl p-6 shadow-sm border'>
						<h2 className='text-2xl font-bold mb-1'>{jobPosting.Title}</h2>
						<p className='text-lg text-primary font-semibold mb-3'>
							₹{jobPosting.SalaryFrom.toLocaleString()} - ₹
							{jobPosting.SalaryTo.toLocaleString()}
						</p>
						<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
							<div className='flex items-center space-x-1'>
								<Briefcase className='w-4 h-4' />
								<span>Per Month</span>
							</div>
							<div className='flex items-center space-x-1'>
								<MapPin className='w-4 h-4' />
								<span>{jobPosting.Location}</span>
							</div>
						</div>
						<p className='text-sm text-muted-foreground mt-3'>
							{jobPosting.CompanyDetail}
						</p>
					</div>

					{/* Job Description */}
					{jobPosting.Description && (
						<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
							<h3 className='text-xl font-semibold'>Job Description</h3>
							<p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
								{jobPosting.Description}
							</p>
						</div>
					)}

					{/* Responsibilities */}
					{jobPosting.Responsibility && (
						<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
							<h3 className='text-xl font-semibold'>Responsibilities</h3>
							<p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
								{jobPosting.Responsibility}
							</p>
						</div>
					)}

					{/* Qualifications & Requirements */}
					<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
						<h3 className='text-xl font-semibold'>Requirements</h3>
						<div className='space-y-3'>
							{jobPosting.Qualification && (
								<div className='flex items-start gap-2'>
									<span className='text-sm font-medium'>Qualification:</span>
									<span className='text-sm text-muted-foreground flex-1'>
										{jobPosting.Qualification}
									</span>
								</div>
							)}
							{jobPosting.AvailablePositionCount > 0 && (
								<div className='flex items-center gap-2'>
									<Users className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm text-muted-foreground'>
										{jobPosting.AvailablePositionCount} {jobPosting.AvailablePositionCount === 1 ? 'position' : 'positions'} available
									</span>
								</div>
							)}
							{jobPosting.DeadLineDate && (
								<div className='flex items-center gap-2'>
									<Calendar className='w-4 h-4 text-muted-foreground' />
									<span className='text-sm text-muted-foreground'>
										Application Deadline: {new Date(jobPosting.DeadLineDate).toLocaleDateString()}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className='p-4 border-t bg-background'>
				<Button onClick={handleApply} className='w-full h-12'>
					Apply Now
				</Button>
			</div>
		</div>
	)
}
