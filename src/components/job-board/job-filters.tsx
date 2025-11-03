'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { useApp } from "@/lib/context/app-context"
import * as Icons from 'lucide-react'
import { useTranslations } from 'next-intl'

export function JobFilters() {
	// const { filters, setFilters, setShowFilters } = useApp()
	const t = useTranslations()

	const resetFilters = () => {
		// setFilters({
		//   salaryMin: 0,
		//   salaryMax: 100000,
		//   location: "",
		//   hasTraining: false,
		//   hasCertification: false,
		//   skillLevel: "all",
		//   trainingType: "all",
		//   maxDistance: 50,
		//   paymentType: "all",
		// })
	}

	return (
		<div>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-sm font-semibold'>{t('jobs.filters')}</h3>
				<Button
					variant='ghost'
					size='sm'
					onClick={resetFilters}
					className='h-7 text-xs'
				>
					<Icons.RotateCcw className='w-3 h-3 mr-1' />
					{t('common.reset')}
				</Button>
			</div>

			<div className='space-y-4'>
				{/* Skill Level Filter */}
				<div>
					<label className='text-xs font-medium mb-1.5 block'>
						Skill Level
					</label>
					<select
						// value={filters.skillLevel}
						// onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value as any })}
						className='w-full h-9 px-2 text-sm border rounded-md bg-background'
					>
						<option value='all'>All Levels</option>
						<option value='gray'>No Certification Needed</option>
						<option value='yellow'>Verified Skills</option>
						<option value='green'>Certified</option>
					</select>
				</div>

				{/* Training Type Filter */}
				<div>
					<label className='text-xs font-medium mb-1.5 block'>Training</label>
					<select
						// value={filters.trainingType}
						// onChange={(e) => setFilters({ ...filters, trainingType: e.target.value as any })}
						className='w-full h-9 px-2 text-sm border rounded-md bg-background'
					>
						<option value='all'>All</option>
						<option value='csr'>Free Training</option>
						<option value='self-paid'>Paid Training</option>
						<option value='none'>No Training</option>
					</select>
				</div>

				{/* Payment Type Filter */}
				<div>
					<label className='text-xs font-medium mb-1.5 block'>Payment</label>
					<select
						// value={filters.paymentType}
						// onChange={(e) => setFilters({ ...filters, paymentType: e.target.value as any })}
						className='w-full h-9 px-2 text-sm border rounded-md bg-background'
					>
						<option value='all'>All Types</option>
						<option value='daily'>Daily</option>
						<option value='weekly'>Weekly</option>
						<option value='monthly'>Monthly</option>
						<option value='per-task'>Per Task</option>
					</select>
				</div>

				{/* Distance Filter */}
				<div>
					<label className='text-xs font-medium mb-1.5 block'>
						{/* Max Distance: {filters.maxDistance}km */}
					</label>
					<input
						type='range'
						min='1'
						max='50'
						// value={filters.maxDistance}
						// onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
						className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
					/>
				</div>

				{/* Salary Range */}
				<div className='grid grid-cols-2 gap-2'>
					<div>
						<label className='text-xs font-medium mb-1.5 block'>
							Min Salary
						</label>
						<Input
							type='number'
							// value={filters.salaryMin}
							// onChange={(e) => setFilters({ ...filters, salaryMin: Number(e.target.value) })}
							className='h-9 text-sm'
							placeholder='0'
						/>
					</div>
					<div>
						<label className='text-xs font-medium mb-1.5 block'>
							Max Salary
						</label>
						<Input
							type='number'
							// value={filters.salaryMax}
							// onChange={(e) => setFilters({ ...filters, salaryMax: Number(e.target.value) })}
							className='h-9 text-sm'
							placeholder='100000'
						/>
					</div>
				</div>

				{/* Location Filter */}
				<div>
					<label className='text-xs font-medium mb-1.5 block'>
						{t('jobs.location')}
					</label>
					<Input
						// value={filters.location}
						// onChange={(e) => setFilters({ ...filters, location: e.target.value })}
						placeholder='Enter location...'
						className='h-9 text-sm'
					/>
				</div>
			</div>

			<div className='mt-4 flex gap-2 lg:hidden'>
				<Button
					// onClick={() => setShowFilters(false)}
					className='flex-1 h-9 text-sm'
				>
					{t('common.apply')}
				</Button>
				<Button
					variant='outline'
					//  onClick={() => setShowFilters(false)}
					className='h-9 px-3'
				>
					<Icons.X className='w-4 h-4' />
				</Button>
			</div>
		</div>
	)
}
