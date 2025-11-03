'use client'

import { Button } from '@/components/ui/button'
import { JobPosting } from '@/types/job'
import { ArrowLeft, Briefcase, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
// import { calculateProfileCompletion } from "@/lib/utils/profile-completion"
import { useState } from 'react'
// import { StageBGateModal } from "./stage-b-gate-modal"

// TODO: Replace with Redux selectors
const MOCK_SELECTED_JOB: JobPosting = {
	id: '1',
	postedOn: new Date('2025-10-28'),
	jobTitle: 'Software Developer',
	salary: {
		min: 300000,
		max: 600000,
		currency: 'INR',
	},
	jobType: 'full-time',
	jobDistance: 5.4,
	hiringCompany: 'Tech Innovations Pvt Ltd',
	jobLocation: 'Mumbai, Maharashtra',
	jobDescription:
		'We are looking for a skilled and motivated Software Developer to join our team. The ideal candidate will have a strong understanding of JavaScript and React, with experience in building modern web applications. This role involves developing new features, maintaining existing code, and collaborating with cross-functional teams to deliver high-quality software solutions.',
	jobRequirements: [
		'3+ years of proven experience in JavaScript and React',
		'Strong knowledge of HTML5, CSS3, and modern web development practices',
		'Experience with REST APIs and asynchronous programming',
		'Familiarity with version control systems (Git)',
		'Good problem-solving and communication skills',
		'Ability to work in a team environment and collaborate effectively',
	],
	jobBenefits: [
		'Competitive salary ranging from ₹3,00,000 to ₹6,00,000 per annum',
		'Health insurance coverage for employee and family',
		'Opportunities for training and skill development',
		'Flexible work hours and hybrid work model',
		'Annual performance bonuses',
		'Positive work environment with growth opportunities',
	],
	hiringCompanyDesc:
		'Tech Innovations Pvt Ltd is a leading software development company specializing in cutting-edge web and mobile applications. With over 10 years of experience in the industry, we are committed to excellence, innovation, and providing our employees with opportunities for professional growth and development. Our team works on diverse projects across various domains, fostering a collaborative and dynamic work culture.',
}

export default function JobDetails() {
	const router = useRouter()
	// TODO: Replace with Redux state
	const [selectedJob] = useState<null | JobPosting>(MOCK_SELECTED_JOB)
	const [showStageBGate, setShowStageBGate] = useState(false)

	// TODO: Replace with Redux dispatch
	const handleBack = () => {
		router.push('/dashboard')
		console.log('Navigate back - TODO: implement with Redux')
	}

	if (!selectedJob) return null

	// const handleApply = () => {
	//   // TODO: Replace with Redux selectors
	//   const phoneNumber = ""
	//   const username = ""
	//   const email = ""
	//   const stageAData = null
	//   const stageBData = null
	//   const stageCData = null

	//   const completion = calculateProfileCompletion(phoneNumber, username, email, stageAData, stageBData, stageCData)

	//   if (completion < 70) {
	//     setShowStageBGate(true)
	//   } else {
	//     // TODO: Implement actual job application
	//     alert("Application submitted!")
	//   }
	// }

	return (
		<>
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
							<h2 className='text-2xl font-bold mb-1'>
								{selectedJob.jobTitle}
							</h2>
							<p className='text-lg text-primary font-semibold mb-3'>
								₹{selectedJob.salary.min.toLocaleString()} - ₹
								{selectedJob.salary.max.toLocaleString()}
							</p>
							<div className='flex items-center space-x-4 text-sm text-muted-foreground'>
								<div className='flex items-center space-x-1'>
									<Briefcase className='w-4 h-4' />
									<span className='capitalize'>{selectedJob.jobType}</span>
								</div>
								<div className='flex items-center space-x-1'>
									<MapPin className='w-4 h-4' />
									<span>{selectedJob.jobDistance} km away</span>
								</div>
							</div>
							<p className='text-sm text-muted-foreground mt-3'>
								{selectedJob.hiringCompany} • {selectedJob.jobLocation}
							</p>
						</div>

						{/* Job Description */}
						<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
							<h3 className='text-xl font-semibold'>Job Description</h3>
							<p className='text-muted-foreground leading-relaxed'>
								{selectedJob.jobDescription}
							</p>
						</div>

						{/* Requirements */}
						<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
							<h3 className='text-xl font-semibold'>Requirements</h3>
							<ul className='space-y-2 text-sm text-muted-foreground list-disc pl-5'>
								{selectedJob.jobRequirements.map((requirement, index) => (
									<li key={index}>{requirement}</li>
								))}
							</ul>
						</div>

						{/* Benefits */}
						<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
							<h3 className='text-xl font-semibold'>Benefits</h3>
							<ul className='space-y-2 text-sm text-muted-foreground list-disc pl-5'>
								{selectedJob.jobBenefits.map((benefit, index) => (
									<li key={index}>{benefit}</li>
								))}
							</ul>
						</div>

						{/* Company Info */}
						<div className='bg-card rounded-xl p-6 shadow-sm border space-y-4'>
							<h3 className='text-xl font-semibold'>About the Company</h3>
							<p className='text-muted-foreground leading-relaxed'>
								{selectedJob.hiringCompanyDesc}
							</p>
						</div>
					</div>
				</div>

				<div className='p-4 border-t bg-background'>
					{/* <Button onClick={handleApply} className="w-full h-12">
            Apply Now
          </Button> */}
				</div>
			</div>

			{/* {showStageBGate && <StageBGateModal />} */}
		</>
	)
}
