'use client'

import { JobBoardHeader } from './job-board-header'
import { JobFilters } from './job-filters'
import { JobCard } from './job-card'
import { ProfileCompletionBanner } from './profile-completion-banner'
import type { Job } from '@/types/job'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

export default function JobBoard() {
	// const { showFilters, userSkills, filters, language } = useApp()
	const t = useTranslations()

	const mockJobs: Job[] = [
		// No cert required (25%)
		{
			id: 1,
			title: 'Delivery Partner',
			titleTranslations: {
				hinglish: 'Delivery Partner',
				hindi: 'डिलीवरी पार्टनर',
				english: 'Delivery Partner',
				kannada: 'ವಿತರಣಾ ಪಾಲುದಾರ',
			},
			company: 'Swiggy',
			location: 'Mumbai',
			salaryMin: 600,
			salaryMax: 900,
			paymentType: 'daily',
			requiredSkill: 'Delivery',
			requiredSkillLevel: 'gray',
			skillLevel: 1,
			distance: 1.2,
			requirements: {
				skillLevel: 'gray',
				canApplyWithoutCert: true,
				mustCertifyFirst: false,
			},
			descriptionTranslations: {
				hinglish: 'Food delivery karo aur daily paise kamao',
				hindi: 'खाना डिलीवर करें और रोज़ाना पैसे कमाएं',
				english: 'Deliver food and earn daily',
				kannada: 'ಆಹಾರ ವಿತರಣಾ ತಯಾರಿಕೆ ಕೆಲಸ',
			},
		},
		{
			id: 2,
			title: 'Warehouse Helper',
			titleTranslations: {
				hinglish: 'Warehouse Helper',
				hindi: 'गोदाम सहायक',
				english: 'Warehouse Helper',
				kannada: 'ಗೋದಾಮು ಸಹಾಯಕ',
			},
			company: 'Amazon',
			location: 'Navi Mumbai',
			salaryMin: 15000,
			salaryMax: 20000,
			paymentType: 'monthly',
			requiredSkill: 'Warehouse',
			requiredSkillLevel: 'gray',
			skillLevel: 1,
			distance: 3.5,
			requirements: {
				skillLevel: 'gray',
				canApplyWithoutCert: true,
				mustCertifyFirst: false,
			},
			training: {
				type: 'csr',
				provider: 'AHALTS Academy',
				cost: 0,
				duration: '1 week',
				mode: 'learn-on-job',
				description: 'Learn warehouse operations while working',
			},
			descriptionTranslations: {
				hinglish: 'Warehouse mein kaam karo aur training pao',
				hindi: 'गोदाम में काम करें और प्रशिक्षण पाएं',
				english: 'Work in warehouse and get training',
				kannada: 'ಗೋದಾಮಿನಲ್ಲಿ ಕೆಲಸ ಮಾಡಿ ಮತ್ತು ತರಬೇತಿ ಪಡೆಯಿರಿ',
			},
		},
		{
			id: 3,
			title: 'Housekeeping Staff',
			titleTranslations: {
				hinglish: 'Housekeeping Staff',
				hindi: 'हाउसकीपिंग स्टाफ',
				english: 'Housekeeping Staff',
				kannada: 'ಹೌಸ್‌ಕೀಪಿಂಗ್ ಸಿಬ್ಬಂದಿ',
			},
			company: 'Taj Hotels',
			location: 'Mumbai',
			salaryMin: 18000,
			salaryMax: 25000,
			paymentType: 'monthly',
			requiredSkill: 'Housekeeping',
			requiredSkillLevel: 'gray',
			skillLevel: 1,
			distance: 4.2,
			requirements: {
				skillLevel: 'gray',
				canApplyWithoutCert: true,
				mustCertifyFirst: false,
			},
			descriptionTranslations: {
				hinglish: 'Hotel mein safai ka kaam',
				hindi: 'होटल में सफाई का काम',
				english: 'Hotel cleaning work',
				kannada: 'ಹೋಟೆಲ್ ಶುಚಿಗೊಳಿಸುವ ಕೆಲಸ',
			},
		},

		// Verified skills required (20%)
		{
			id: 4,
			title: 'Senior Plumber',
			titleTranslations: {
				hinglish: 'Senior Plumber',
				hindi: 'वरिष्ठ प्लंबर',
				english: 'Senior Plumber',
				kannada: 'ಹಿರಿಯ ಪ್ಲಂಬರ್',
			},
			company: 'Reliance',
			location: 'Navi Mumbai',
			salaryMin: 2500,
			salaryMax: 4000,
			paymentType: 'per-task',
			requiredSkill: 'Plumbing',
			requiredSkillLevel: 'yellow',
			skillLevel: 3,
			distance: 5.2,
			requirements: {
				skillLevel: 'yellow',
				canApplyWithoutCert: false,
				mustCertifyFirst: false,
			},
			training: {
				type: 'csr',
				provider: 'AHALTS Academy',
				cost: 0,
				duration: '2 weeks',
				mode: 'learn-first',
				description: 'Fast-track to verified status',
			},
			descriptionTranslations: {
				hinglish: 'Plumbing ka kaam, verified skills chahiye',
				hindi: 'प्लंबिंग का काम, सत्यापित कौशल चाहिए',
				english: 'Plumbing work, verified skills needed',
				kannada: 'ಪ್ಲಂಬಿಂಗ್ ಕೆಲಸ, ಪರಿಶೀಲಿಸಿದ ಕೌಶಲ್ಯಗಳು ಬೇಕು',
			},
		},
		{
			id: 5,
			title: 'Experienced Cook',
			titleTranslations: {
				hinglish: 'Experienced Cook',
				hindi: 'अनुभवी रसोइया',
				english: 'Experienced Cook',
				kannada: 'ಅನುಭವಿ ಅಡುಗೆಯವರು',
			},
			company: 'Zomato',
			location: 'Thane',
			salaryMin: 25000,
			salaryMax: 35000,
			paymentType: 'monthly',
			requiredSkill: 'Cooking',
			requiredSkillLevel: 'yellow',
			skillLevel: 3,
			distance: 6.8,
			requirements: {
				skillLevel: 'yellow',
				canApplyWithoutCert: false,
				mustCertifyFirst: false,
			},
			descriptionTranslations: {
				hinglish: 'Restaurant mein khana banana, experience chahiye',
				hindi: 'रेस्तरां में खाना बनाना, अनुभव चाहिए',
				english: 'Restaurant cooking, experience needed',
				kannada: 'ರೆಸ್ಟೋರೆಂಟ್ ಅಡುಗೆ, ಅನುಭವ ಬೇಕು',
			},
		},

		// Certified required (50%)
		{
			id: 6,
			title: 'Certified Electrician',
			titleTranslations: {
				hinglish: 'Certified Electrician',
				hindi: 'प्रमाणित इलेक्ट्रीशियन',
				english: 'Certified Electrician',
				kannada: 'ಪ್ರಮಾಣೀಕೃತ ವಿದ್ಯುತ್ ತಂತ್ರಜ್ಞ',
			},
			company: 'TCS',
			location: 'Mumbai',
			salaryMin: 35000,
			salaryMax: 50000,
			paymentType: 'monthly',
			requiredSkill: 'Electrical',
			requiredSkillLevel: 'green',
			skillLevel: 4,
			distance: 2.5,
			requirements: {
				skillLevel: 'green',
				canApplyWithoutCert: false,
				mustCertifyFirst: true,
			},
			training: {
				type: 'csr',
				provider: 'AHALTS Academy',
				cost: 0,
				duration: '1 month',
				mode: 'learn-first',
				description: 'Company-sponsored NSDC certification',
			},
			descriptionTranslations: {
				hinglish:
					'Electrical kaam, NSDC certificate chahiye. Free training available',
				hindi: 'विद्युत कार्य, NSDC प्रमाणपत्र चाहिए। मुफ्त प्रशिक्षण उपलब्ध',
				english:
					'Electrical work, NSDC certificate required. Free training available',
				kannada: 'ವಿದ್ಯುತ್ ಕೆಲಸ, NSDC ಪ್ರಮಾಣಪತ್ರ ಬೇಕು. ಉಚಿತ ತರಬೇತಿ ಲಭ್ಯವಿದೆ',
			},
		},
		{
			id: 7,
			title: 'Certified Welder',
			titleTranslations: {
				hinglish: 'Certified Welder',
				hindi: 'प्रमाणित वेल्डर',
				english: 'Certified Welder',
				kannada: 'ಪ್ರಮಾಣೀಕೃತ ವೆಲ್ಡರ್',
			},
			company: 'Tata Steel',
			location: 'Thane',
			salaryMin: 45000,
			salaryMax: 60000,
			paymentType: 'monthly',
			requiredSkill: 'Welding',
			requiredSkillLevel: 'green',
			skillLevel: 5,
			distance: 8.1,
			requirements: {
				skillLevel: 'green',
				canApplyWithoutCert: false,
				mustCertifyFirst: true,
			},
			training: {
				type: 'self-paid',
				provider: 'SDC Center',
				cost: 8000,
				duration: '3 weeks',
				mode: 'learn-first',
				description: 'Get certified and apply',
			},
			descriptionTranslations: {
				hinglish: 'Welding ka kaam, certification zaruri. Training ₹8000',
				hindi: 'वेल्डिंग का काम, प्रमाणन जरूरी। प्रशिक्षण ₹8000',
				english: 'Welding work, certification required. Training ₹8000',
				kannada: 'ವೆಲ್ಡಿಂಗ್ ಕೆಲಸ, ಪ್ರಮಾಣೀಕರಣ ಅಗತ್ಯ. ತರಬೇತಿ ₹8000',
			},
		},
		{
			id: 8,
			title: 'HVAC Technician',
			titleTranslations: {
				hinglish: 'HVAC Technician',
				hindi: 'HVAC तकनीशियन',
				english: 'HVAC Technician',
				kannada: 'HVAC ತಂತ್ರಜ್ಞ',
			},
			company: 'Godrej',
			location: 'Mumbai',
			salaryMin: 40000,
			salaryMax: 55000,
			paymentType: 'monthly',
			requiredSkill: 'HVAC',
			requiredSkillLevel: 'green',
			skillLevel: 4,
			distance: 3.2,
			requirements: {
				skillLevel: 'green',
				canApplyWithoutCert: false,
				mustCertifyFirst: true,
			},
			training: {
				type: 'csr',
				provider: 'AHALTS Academy',
				cost: 0,
				duration: '6 weeks',
				mode: 'both',
				description: 'Free certification program',
			},
			descriptionTranslations: {
				hinglish: 'AC repair aur maintenance. Free certification milega',
				hindi: 'AC मरम्मत और रखरखाव। मुफ्त प्रमाणन मिलेगा',
				english: 'AC repair and maintenance. Free certification available',
				kannada: 'AC ದುರಸ್ತಿ ಮತ್ತು ನಿರ್ವಹಣೆ. ಉಚಿತ ಪ್ರಮಾಣೀಕರಣ ಲಭ್ಯವಿದೆ',
			},
		},
		{
			id: 9,
			title: 'Certified Carpenter',
			titleTranslations: {
				hinglish: 'Certified Carpenter',
				hindi: 'प्रमाणित बढ़ई',
				english: 'Certified Carpenter',
				kannada: 'ಪ್ರಮಾಣೀಕೃತ ಪ್ಲಂಬರ್',
			},
			company: 'L&T',
			location: 'Pune',
			salaryMin: 38000,
			salaryMax: 52000,
			paymentType: 'monthly',
			requiredSkill: 'Carpentry',
			requiredSkillLevel: 'green',
			skillLevel: 4,
			distance: 7.5,
			requirements: {
				skillLevel: 'green',
				canApplyWithoutCert: false,
				mustCertifyFirst: true,
			},
			descriptionTranslations: {
				hinglish: 'Furniture banane ka kaam, certificate chahiye',
				hindi: 'फर्नीचर बनाने का काम, प्रमाणपत्र चाहिए',
				english: 'Furniture making work, certificate required',
				kannada: 'ಪೀಠೋಪಕರಣ ತಯಾರಿಕೆ ಕೆಲಸ, ಪ್ರಮಾಣಪತ್ರ ಬೇಕು',
			},
		},
		{
			id: 10,
			title: 'Industrial Mechanic',
			titleTranslations: {
				hinglish: 'Industrial Mechanic',
				hindi: 'औद्योगिक मैकेनिक',
				english: 'Industrial Mechanic',
				kannada: 'ಕೈಗಾರಿಕಾ ಮೆಕ್ಯಾನಿಕ್',
			},
			company: 'Mahindra',
			location: 'Navi Mumbai',
			salaryMin: 42000,
			salaryMax: 58000,
			paymentType: 'monthly',
			requiredSkill: 'Mechanics',
			requiredSkillLevel: 'green',
			skillLevel: 5,
			distance: 5.8,
			requirements: {
				skillLevel: 'green',
				canApplyWithoutCert: false,
				mustCertifyFirst: true,
			},
			training: {
				type: 'self-paid',
				provider: 'ITI Center',
				cost: 12000,
				duration: '2 months',
				mode: 'learn-first',
				description: 'ITI certification required',
			},
			descriptionTranslations: {
				hinglish: 'Machine repair ka kaam. ITI certificate ₹12000',
				hindi: 'मशीन मरम्मत का काम। ITI प्रमाणपत्र ₹12000',
				english: 'Machine repair work. ITI certificate ₹12000',
				kannada: 'ಯಂತ್ರ ದುರಸ್ತಿ ಕೆಲಸ. ITI ಪ್ರಮಾಣಪತ್ರ ₹12000',
			},
		},
		{
			id: 11,
			title: 'Safety Officer',
			titleTranslations: {
				hinglish: 'Safety Officer',
				hindi: 'सुरक्षा अधिकारी',
				english: 'Safety Officer',
				kannada: 'ಸುರಕ್ಷತಾ ಅಧಿಕಾರಿ',
			},
			company: 'Reliance',
			location: 'Mumbai',
			salaryMin: 35000,
			salaryMax: 48000,
			paymentType: 'monthly',
			requiredSkill: 'Safety',
			requiredSkillLevel: 'green',
			skillLevel: 4,
			distance: 4.1,
			requirements: {
				skillLevel: 'green',
				canApplyWithoutCert: false,
				mustCertifyFirst: true,
			},
			training: {
				type: 'csr',
				provider: 'AHALTS Academy',
				cost: 0,
				duration: '3 weeks',
				mode: 'learn-first',
				description: 'Free safety certification',
			},
			descriptionTranslations: {
				hinglish: 'Safety ka kaam. Free training aur certificate',
				hindi: 'सुरक्षा का काम। मुफ्त प्रशिक्षण और प्रमाणपत्र',
				english: 'Safety work. Free training and certificate',
				kannada: 'ಸುರಕ್ಷತಾ ಕೆಲಸ. ಉಚಿತ ತರಬೇತಿ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರ',
			},
		},
	]

	// const filteredAndShuffledJobs = useMemo(() => {
	//   const filtered = mockJobs.filter((job) => {
	//     // Skill level filter
	//     if (filters.skillLevel !== "all" && job.requiredSkillLevel !== filters.skillLevel) {
	//       return false
	//     }

	//     // Training type filter
	//     if (filters.trainingType !== "all") {
	//       if (filters.trainingType === "none" && job.training) return false
	//       if (filters.trainingType === "csr" && job.training?.type !== "csr") return false
	//       if (filters.trainingType === "self-paid" && job.training?.type !== "self-paid") return false
	//     }

	//     // Payment type filter
	//     if (filters.paymentType !== "all" && job.paymentType !== filters.paymentType) {
	//       return false
	//     }

	//     // Distance filter
	//     if (job.distance > filters.maxDistance) {
	//       return false
	//     }

	//     // Salary filter
	//     if (job.salaryMin < filters.salaryMin || job.salaryMax > filters.salaryMax) {
	//       return false
	//     }

	//     // Location filter
	//     if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
	//       return false
	//     }

	//     return true
	//   })

	//   // Shuffle to mix job types
	//   return filtered
	// }, [filters])

	const canApplyForJob = (job: Job) => {
		// const userSkillData = userSkills[job.requiredSkill]
		// if (!userSkillData) return job.requiredSkillLevel === "gray"

		// if (job.requiredSkillLevel === "green") {
		//   return userSkillData.level === "green"
		// }
		// if (job.requiredSkillLevel === "yellow") {
		//   return userSkillData.level === "yellow" || userSkillData.level === "green"
		// }
		return true
	}

	const getJobTitle = (job: Job) => {
		// if (job.titleTranslations && job.titleTranslations[language]) {
		//   return job.titleTranslations[language]
		// }
		return job.title
	}

	const getJobDescription = (job: Job) => {
		// if (job.descriptionTranslations && job.descriptionTranslations[language]) {
		//   return job.descriptionTranslations[language]
		// }
		return job.description || ''
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<JobBoardHeader />

			{/* {showFilters && ( */}
			{
				<div className='lg:hidden'>
					<JobFilters />
				</div>
			}

			<div className='flex-1 flex overflow-hidden'>
				{/* Desktop sidebar filters */}
				<aside className='hidden lg:block w-80 border-r bg-background overflow-y-auto'>
					<div className='p-6'>
						<JobFilters />
					</div>
				</aside>

				{/* Job listings */}
				<main className='flex-1 overflow-y-auto'>
					<div className='p-3 lg:p-6'>
						<div className='max-w-md mx-auto lg:max-w-none mb-4'>
							<ProfileCompletionBanner />
						</div>

						<div className='max-w-md mx-auto lg:max-w-none lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4'>
							{mockJobs.length === 0 ? (
								<div className='col-span-full text-center py-12 text-muted-foreground text-sm'>
									{t('jobs.noJobs')}
								</div>
							) : (
								mockJobs.map(job => {
									const canApply = canApplyForJob(job)
									// const userSkillData = userSkills[job.requiredSkill]

									return (
										<div key={job.id} className='mb-3 lg:mb-0'>
											<JobCard
												job={{
													...job,
													title: getJobTitle(job),
													description: getJobDescription(job),
												}}
												canApply={canApply}
												// userSkillLevel={userSkillData?.level}
											/>
										</div>
									)
								})
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
