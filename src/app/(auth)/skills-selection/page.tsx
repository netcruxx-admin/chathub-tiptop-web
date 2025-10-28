'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

const skillsData = [
	{ id: 1, name: 'Delivery', category: 'delivery', jobs: 5000 },
	{ id: 2, name: 'Housekeeping', category: 'housekeeping', jobs: 3000 },
	{ id: 3, name: 'Construction', category: 'construction', jobs: 4500 },
	{ id: 4, name: 'Food Service', category: 'food', jobs: 2500 },
	{ id: 5, name: 'Warehouse', category: 'warehouse', jobs: 3500 },
	{ id: 6, name: 'Maintenance', category: 'maintenance', jobs: 2000 },
	{ id: 7, name: 'Office Work', category: 'office', jobs: 1500 },
	{ id: 8, name: 'Security', category: 'security', jobs: 2800 },
	{ id: 9, name: 'Retail', category: 'retail', jobs: 2200 },
	{ id: 10, name: 'Driver', category: 'delivery', jobs: 4000 },
	{ id: 11, name: 'Cook', category: 'food', jobs: 1800 },
	{ id: 12, name: 'Electrician', category: 'maintenance', jobs: 1600 },
]

export default function SkillsSelection() {
	const router = useRouter()
	const [selectedSkills, setSelectedSkills] = useState<number[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [openToAnyWork, setOpenToAnyWork] = useState(false)

	const filteredSkills = skillsData.filter(skill =>
		skill.name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const toggleSkill = (skillId: number) => {
		if (openToAnyWork) {
			setOpenToAnyWork(false)
		}
		setSelectedSkills(prev =>
			prev.includes(skillId)
				? prev.filter(id => id !== skillId)
				: [...prev, skillId]
		)
	}

	const handleOpenToAnyWork = () => {
		setOpenToAnyWork(!openToAnyWork)
		if (!openToAnyWork) {
			setSelectedSkills([])
		}
	}

	const handleContinue = () => {
		const skillsToSave = openToAnyWork
			? { openToAny: true, skills: [] }
			: {
					openToAny: false,
					skills: skillsData.filter(s => selectedSkills.includes(s.id)),
			  }
		localStorage.setItem('selectedSkills', JSON.stringify(skillsToSave))
		router.push('/location-selection')
	}

	const isValid = openToAnyWork || selectedSkills.length > 0

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
					<h1 className='text-lg font-semibold'>Select Your Skills</h1>
					<p className='text-xs text-muted-foreground'>
						{selectedSkills.length} selected
					</p>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-4 sm:p-6'>
				<div className='max-w-2xl mx-auto space-y-4'>
					{/* Open to Any Work Option */}
					<button
						onClick={handleOpenToAnyWork}
						className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
							openToAnyWork
								? 'border-primary bg-primary/5'
								: 'border-border hover:border-primary/50'
						}`}
					>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<h3 className='font-semibold text-base mb-1'>
									I'm new and open to any work
								</h3>
								<p className='text-sm text-muted-foreground'>
									Entry-level jobs
								</p>
							</div>
							<div
								className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
									openToAnyWork
										? 'bg-primary border-primary'
										: 'border-gray-300'
								}`}
							>
								{openToAnyWork && (
									<svg
										className='w-3 h-3 text-white'
										fill='none'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='3'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path d='M5 13l4 4L19 7' />
									</svg>
								)}
							</div>
						</div>
						{openToAnyWork && (
							<div className='mt-2 text-xs text-primary font-medium'>
								Auto-selected
							</div>
						)}
					</button>

					{/* Search Bar */}
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<input
							type='text'
							placeholder='Search skills...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='w-full h-11 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
						/>
					</div>

					{/* Info Message */}
					<div className='bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3'>
						<p className='text-sm text-blue-800 dark:text-blue-200'>
							Select all skills that apply to you. You can always add more
							skills later from your profile.
						</p>
					</div>

					{/* Skills Grid */}
					<div>
						<h3 className='font-semibold mb-3'>Skills</h3>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
							{filteredSkills.map(skill => {
								const isSelected = selectedSkills.includes(skill.id)
								return (
									<button
										key={skill.id}
										onClick={() => toggleSkill(skill.id)}
										disabled={openToAnyWork}
										className={`p-3 border-2 rounded-xl text-left transition-all ${
											isSelected
												? 'border-primary bg-primary/5'
												: 'border-border hover:border-primary/50'
										} ${openToAnyWork ? 'opacity-50 cursor-not-allowed' : ''}`}
									>
										<div className='flex items-start justify-between mb-2'>
											<h4 className='font-medium text-sm'>{skill.name}</h4>
											<div
												className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
													isSelected
														? 'bg-primary border-primary'
														: 'border-gray-300'
												}`}
											>
												{isSelected && (
													<svg
														className='w-2.5 h-2.5 text-white'
														fill='none'
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='3'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path d='M5 13l4 4L19 7' />
													</svg>
												)}
											</div>
										</div>
										<p className='text-xs text-muted-foreground'>
											{skill.jobs} jobs
										</p>
									</button>
								)
							})}
						</div>
					</div>

					{filteredSkills.length === 0 && (
						<div className='text-center py-8'>
							<p className='text-muted-foreground'>No skills found</p>
						</div>
					)}
				</div>
			</div>

			<div className='p-4 border-t'>
				<Button
					onClick={handleContinue}
					disabled={!isValid}
					className='w-full'
					size='lg'
				>
					Continue
					<ArrowRight className='w-5 h-5 ml-2' />
				</Button>
			</div>
		</div>
	)
}
