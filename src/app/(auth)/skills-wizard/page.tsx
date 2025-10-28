'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import {
	ArrowLeft,
	ArrowRight,
	User,
	Zap,
	Droplet,
	Hammer,
	Flame,
	Paintbrush,
	HardHat,
	Home,
	Shield,
	Truck,
	ShoppingBag,
	Wrench,
	Car,
	Bike,
	UtensilsCrossed,
	Package,
	Warehouse,
	Building2,
	Scissors,
	Shirt,
	Laptop,
	Phone,
	Camera,
	Leaf,
	Trees,
	Dog,
	Baby,
	Stethoscope,
	Search,
	CheckCircle2,
	Sparkles,
	ChevronRight,
	ChevronDown,
	ChevronUp,
} from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setJobRole } from '@/redux/slices/authSlice'

type WizardStep = 'choice' | 'categories' | 'skills'

export default function SkillsWizard() {
	const t = useTranslations()
	const router = useRouter()
	const dispatch = useDispatch()
	const [wizardStep, setWizardStep] = useState<WizardStep>('choice')
	const [selectedCategories, setSelectedCategories] = useState<string[]>([])
	const [expandedCategories, setExpandedCategories] = useState<string[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedSkills, setSelectedSkills] = useState<string[]>([])

	const availableSkills = [
		// Delivery & Logistics
		{ id: 'bike-riding', name: 'Bike Riding', icon: Bike, category: 'delivery', jobCount: 245 },
		{ id: 'delivery', name: 'Package Delivery', icon: Package, category: 'delivery', jobCount: 189 },
		{ id: 'food-delivery', name: 'Food Delivery', icon: UtensilsCrossed, category: 'delivery', jobCount: 156 },
		{ id: 'driving-car', name: 'Car Driving', icon: Car, category: 'delivery', jobCount: 98 },
		{ id: 'navigation', name: 'Navigation', icon: Truck, category: 'delivery', jobCount: 134 },

		// Housekeeping & Cleaning
		{ id: 'housekeeping', name: 'Housekeeping', icon: Home, category: 'housekeeping', jobCount: 167 },
		{ id: 'cleaning', name: 'Cleaning', icon: Droplet, category: 'housekeeping', jobCount: 201 },
		{ id: 'laundry', name: 'Laundry', icon: Shirt, category: 'housekeeping', jobCount: 78 },
		{ id: 'dishwashing', name: 'Dishwashing', icon: UtensilsCrossed, category: 'housekeeping', jobCount: 92 },

		// Construction & Labor
		{ id: 'construction', name: 'Construction', icon: HardHat, category: 'construction', jobCount: 178 },
		{ id: 'painting', name: 'Painting', icon: Paintbrush, category: 'construction', jobCount: 145 },
		{ id: 'carpentry', name: 'Carpentry', icon: Hammer, category: 'construction', jobCount: 112 },
		{ id: 'welding', name: 'Welding', icon: Flame, category: 'construction', jobCount: 89 },
		{ id: 'heavy-lifting', name: 'Heavy Lifting', icon: Package, category: 'construction', jobCount: 156 },
		{ id: 'masonry', name: 'Masonry', icon: Building2, category: 'construction', jobCount: 67 },

		// Food Service
		{ id: 'cooking', name: 'Cooking', icon: UtensilsCrossed, category: 'food', jobCount: 134 },
		{ id: 'food-prep', name: 'Food Preparation', icon: UtensilsCrossed, category: 'food', jobCount: 98 },
		{ id: 'serving', name: 'Serving', icon: ShoppingBag, category: 'food', jobCount: 87 },
		{ id: 'kitchen-helper', name: 'Kitchen Helper', icon: UtensilsCrossed, category: 'food', jobCount: 123 },

		// Warehouse & Factory
		{ id: 'packing', name: 'Packing', icon: Package, category: 'warehouse', jobCount: 189 },
		{ id: 'sorting', name: 'Sorting', icon: Warehouse, category: 'warehouse', jobCount: 145 },
		{ id: 'inventory', name: 'Inventory Management', icon: Warehouse, category: 'warehouse', jobCount: 76 },
		{ id: 'loading', name: 'Loading/Unloading', icon: Truck, category: 'warehouse', jobCount: 167 },
		{ id: 'machine-operation', name: 'Machine Operation', icon: Wrench, category: 'warehouse', jobCount: 54 },

		// Maintenance & Repair
		{ id: 'plumbing', name: 'Plumbing', icon: Droplet, category: 'maintenance', jobCount: 134 },
		{ id: 'electrical', name: 'Electrical Work', icon: Zap, category: 'maintenance', jobCount: 156 },
		{ id: 'ac-repair', name: 'AC Repair', icon: Wrench, category: 'maintenance', jobCount: 89 },
		{ id: 'appliance-repair', name: 'Appliance Repair', icon: Wrench, category: 'maintenance', jobCount: 67 },
		{ id: 'general-repair', name: 'General Repairs', icon: Hammer, category: 'maintenance', jobCount: 112 },

		// Office & Admin
		{ id: 'data-entry', name: 'Data Entry', icon: Laptop, category: 'office', jobCount: 98 },
		{ id: 'filing', name: 'Filing', icon: Laptop, category: 'office', jobCount: 45 },
		{ id: 'phone-handling', name: 'Phone Handling', icon: Phone, category: 'office', jobCount: 67 },
		{ id: 'basic-computer', name: 'Basic Computer', icon: Laptop, category: 'office', jobCount: 123 },

		// Security & Safety
		{ id: 'security', name: 'Security Guard', icon: Shield, category: 'security', jobCount: 178 },
		{ id: 'watchman', name: 'Watchman', icon: Shield, category: 'security', jobCount: 134 },

		// Retail & Sales
		{ id: 'retail', name: 'Retail Sales', icon: ShoppingBag, category: 'retail', jobCount: 145 },
		{ id: 'cashier', name: 'Cashier', icon: ShoppingBag, category: 'retail', jobCount: 98 },
		{ id: 'stocking', name: 'Stocking', icon: Package, category: 'retail', jobCount: 87 },

		// Personal Services
		{ id: 'salon', name: 'Salon Services', icon: Scissors, category: 'personal', jobCount: 76 },
		{ id: 'beauty', name: 'Beauty Services', icon: Paintbrush, category: 'personal', jobCount: 54 },
		{ id: 'photography', name: 'Photography', icon: Camera, category: 'personal', jobCount: 43 },

		// Care Services
		{ id: 'childcare', name: 'Childcare', icon: Baby, category: 'care', jobCount: 89 },
		{ id: 'eldercare', name: 'Elder Care', icon: Stethoscope, category: 'care', jobCount: 67 },
		{ id: 'pet-care', name: 'Pet Care', icon: Dog, category: 'care', jobCount: 45 },

		// Gardening & Outdoor
		{ id: 'gardening', name: 'Gardening', icon: Leaf, category: 'outdoor', jobCount: 78 },
		{ id: 'landscaping', name: 'Landscaping', icon: Trees, category: 'outdoor', jobCount: 56 },
	]

	const categories = [
		{ id: 'delivery', name: 'Delivery & Logistics', icon: Bike },
		{ id: 'housekeeping', name: 'Housekeeping', icon: Home },
		{ id: 'construction', name: 'Construction', icon: HardHat },
		{ id: 'food', name: 'Food Service', icon: UtensilsCrossed },
		{ id: 'warehouse', name: 'Warehouse', icon: Warehouse },
		{ id: 'maintenance', name: 'Maintenance', icon: Wrench },
		{ id: 'office', name: 'Office Support', icon: Laptop },
		{ id: 'security', name: 'Security', icon: Shield },
		{ id: 'retail', name: 'Retail', icon: ShoppingBag },
		{ id: 'personal', name: 'Personal Services', icon: Scissors },
		{ id: 'care', name: 'Care Services', icon: Baby },
		{ id: 'outdoor', name: 'Outdoor', icon: Trees },
	]

	const entryLevelSkillIds = [
		'delivery',
		'cleaning',
		'packing',
		'heavy-lifting',
		'food-delivery',
		'housekeeping',
		'loading',
		'security',
		'kitchen-helper',
		'data-entry',
	]

	const handleOpenToAnyWork = () => {
		dispatch(setJobRole(entryLevelSkillIds))
		localStorage.setItem('selectedSkills', JSON.stringify(entryLevelSkillIds))
		router.push('/location-selection')
	}

	const toggleCategory = (categoryId: string) => {
		setSelectedCategories(prev =>
			prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
		)
	}

	const toggleCategoryExpansion = (categoryId: string) => {
		setExpandedCategories(prev =>
			prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
		)
	}

	const toggleSkill = (skillId: string) => {
		setSelectedSkills(prev =>
			prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
		)
	}

	const handleContinue = () => {
		dispatch(setJobRole(selectedSkills))
		localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills))
		router.push('/location-selection')
	}

	const groupedSkills = selectedCategories.reduce(
		(acc, categoryId) => {
			acc[categoryId] = availableSkills.filter(skill => {
				const matchesCategory = skill.category === categoryId
				const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase())
				return matchesCategory && matchesSearch
			})
			return acc
		},
		{} as Record<string, typeof availableSkills>
	)

	// Calculate progress based on wizard step
	const currentProgress = wizardStep === 'choice' ? 50 : wizardStep === 'categories' ? 60 : 70

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			{/* Header */}
			<div className='p-3 md:p-4 lg:p-6 border-b'>
				<div className='max-w-4xl mx-auto'>
					<div className='flex items-center mb-2'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => {
								if (wizardStep === 'skills') setWizardStep('categories')
								else if (wizardStep === 'categories') setWizardStep('choice')
								else router.back()
							}}
							className='mr-2 h-9 w-9 cursor-pointer'
						>
							<ArrowLeft className='w-4 h-4' />
						</Button>
						<div className='flex-1'>
							<h1 className='text-base md:text-lg font-semibold'>{t('skills.title')}</h1>
							<p className='text-xs md:text-sm text-muted-foreground'>
								{selectedSkills.length > 0
									? `${selectedSkills.length} ${t('skills.selected')}`
									: t('skills.subtitle')}
							</p>
						</div>
					</div>
					<ProgressBar progress={currentProgress} label='Profile Progress' />
				</div>
			</div>

			{/* Content */}
			<div className='flex-1 overflow-y-auto'>
				<div className='p-3 md:p-4 lg:p-6'>
					<div className='max-w-4xl mx-auto space-y-3 md:space-y-4'>
						{/* Step 1: Choice */}
						{wizardStep === 'choice' && (
							<div className='space-y-3 md:space-y-4'>
								<div className='text-center mb-4 md:mb-6'>
									<h2 className='text-lg md:text-xl font-semibold mb-2'>
										Are you open to any work?
									</h2>
									<p className='text-sm md:text-base text-muted-foreground'>
										Choose what works best for you
									</p>
								</div>

								{/* Option 1: Open to any work */}
								<button
									onClick={handleOpenToAnyWork}
									className='w-full p-4 md:p-6 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary hover:shadow-lg transition-all text-left group cursor-pointer'
								>
									<div className='flex items-start justify-between mb-3'>
										<div className='flex items-center space-x-3 md:space-x-4'>
											<div className='w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg'>
												<Sparkles className='w-6 h-6 md:w-7 md:h-7 text-white' />
											</div>
											<div>
												<p className='font-semibold text-base md:text-lg'>
													{t('skills.openToAnyWork')}
												</p>
												<p className='text-sm md:text-base text-muted-foreground mt-1'>
													{t('skills.openToAnyWorkDesc')}
												</p>
											</div>
										</div>
										<ChevronRight className='w-5 h-5 md:w-6 md:h-6 text-primary group-hover:translate-x-1 transition-transform' />
									</div>
									<div className='flex flex-wrap gap-1.5 md:gap-2'>
										{entryLevelSkillIds.slice(0, 5).map(skillId => {
											const skill = availableSkills.find(s => s.id === skillId)
											return skill ? (
												<span
													key={skillId}
													className='text-xs md:text-sm bg-primary/20 text-primary px-2 py-1 rounded-full'
												>
													{skill.name}
												</span>
											) : null
										})}
										<span className='text-xs md:text-sm text-muted-foreground'>
											+{entryLevelSkillIds.length - 5}
										</span>
									</div>
								</button>

								{/* Option 2: Choose specific skills */}
								<button
									onClick={() => setWizardStep('categories')}
									className='w-full p-4 md:p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left group cursor-pointer'
								>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-3 md:space-x-4'>
											<div className='w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg'>
												<Search className='w-6 h-6 md:w-7 md:h-7 text-white' />
											</div>
											<div>
												<p className='font-semibold text-base md:text-lg'>
													Choose specific skills
												</p>
												<p className='text-sm md:text-base text-muted-foreground mt-1'>
													Select from {availableSkills.length} skills
												</p>
											</div>
										</div>
										<ChevronRight className='w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
									</div>
								</button>
							</div>
						)}

						{/* Step 2: Category Selection (Multi-select) */}
						{wizardStep === 'categories' && (
							<div className='space-y-3 md:space-y-4'>
								<div className='text-center mb-4 md:mb-6'>
									<h2 className='text-lg md:text-xl font-semibold mb-2'>Choose categories</h2>
									<p className='text-sm md:text-base text-muted-foreground'>
										Select one or multiple types of work
										{selectedCategories.length > 0 && ` • ${selectedCategories.length} selected`}
									</p>
								</div>

								<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'>
									{categories.map(category => {
										const Icon = category.icon
										const skillCount = availableSkills.filter(s => s.category === category.id)
											.length
										const isSelected = selectedCategories.includes(category.id)
										return (
											<button
												key={category.id}
												onClick={() => toggleCategory(category.id)}
												className={`p-4 md:p-5 rounded-xl border-2 transition-all text-center group cursor-pointer ${
													isSelected
														? 'border-primary bg-primary/5 shadow-sm'
														: 'border-border hover:border-primary/50 hover:bg-accent'
												}`}
											>
												<div className='relative'>
													<div
														className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 rounded-full flex items-center justify-center transition-colors ${
															isSelected
																? 'bg-primary/10'
																: 'bg-muted group-hover:bg-primary/10'
														}`}
													>
														<Icon
															className={`w-6 h-6 md:w-7 md:h-7 transition-colors ${
																isSelected
																	? 'text-primary'
																	: 'text-muted-foreground group-hover:text-primary'
															}`}
														/>
													</div>
													{isSelected && (
														<CheckCircle2 className='w-5 h-5 md:w-6 md:h-6 text-primary absolute -top-1 -right-1' />
													)}
												</div>
												<p
													className={`font-medium text-sm md:text-base mb-1 ${
														isSelected ? 'text-primary' : ''
													}`}
												>
													{t(`skills.categories.${category.id}`)}
												</p>
												<p className='text-xs md:text-sm text-muted-foreground'>
													{skillCount} {t('skills.jobs')}
												</p>
											</button>
										)
									})}
								</div>

								{/* Continue Button */}
								{selectedCategories.length > 0 && (
									<Button
										onClick={() => {
											setWizardStep('skills')
											setExpandedCategories(selectedCategories)
										}}
										className='w-full h-11 md:h-12 cursor-pointer'
									>
										Continue to Skills
										<ArrowRight className='w-4 h-4 md:w-5 md:h-5 ml-2' />
									</Button>
								)}
							</div>
						)}

						{/* Step 3: Skills Selection (Grouped by Category) */}
						{wizardStep === 'skills' && selectedCategories.length > 0 && (
							<div className='space-y-3 md:space-y-4'>
								<div className='mb-4'>
									<h2 className='text-lg md:text-xl font-semibold mb-2'>Select your skills</h2>
									<p className='text-sm md:text-base text-muted-foreground'>
										Choose all skills that apply to you
										{selectedSkills.length > 0 && ` • ${selectedSkills.length} selected`}
									</p>
								</div>

								{/* Search */}
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground' />
									<Input
										type='text'
										placeholder={t('skills.searchPlaceholder')}
										value={searchQuery}
										onChange={e => setSearchQuery(e.target.value)}
										className='pl-10 md:pl-11 h-11 md:h-12'
									/>
								</div>

								{/* Skills Grouped by Category (Collapsible) */}
								<div className='space-y-3 md:space-y-4'>
									{selectedCategories.map(categoryId => {
										const category = categories.find(c => c.id === categoryId)
										if (!category) return null

										const Icon = category.icon
										const categorySkills = groupedSkills[categoryId] || []
										const isExpanded = expandedCategories.includes(categoryId)
										const selectedInCategory = categorySkills.filter(s =>
											selectedSkills.includes(s.id)
										).length

										return (
											<div
												key={categoryId}
												className='border-2 border-border rounded-xl overflow-hidden'
											>
												{/* Category Header */}
												<button
													onClick={() => toggleCategoryExpansion(categoryId)}
													className='w-full p-4 md:p-5 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between cursor-pointer'
												>
													<div className='flex items-center space-x-3 md:space-x-4'>
														<div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-background flex items-center justify-center'>
															<Icon className='w-5 h-5 md:w-6 md:h-6 text-primary' />
														</div>
														<div className='text-left'>
															<p className='font-semibold text-base md:text-lg'>
																{t(`skills.categories.${categoryId}`)}
															</p>
															<p className='text-xs md:text-sm text-muted-foreground'>
																{selectedInCategory > 0
																	? `${selectedInCategory} selected • ${categorySkills.length} total`
																	: `${categorySkills.length} skills`}
															</p>
														</div>
													</div>
													{isExpanded ? (
														<ChevronUp className='w-5 h-5 md:w-6 md:h-6 text-muted-foreground' />
													) : (
														<ChevronDown className='w-5 h-5 md:w-6 md:h-6 text-muted-foreground' />
													)}
												</button>

												{/* Category Skills Grid */}
												{isExpanded && (
													<div className='p-3 md:p-4 bg-background'>
														<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3'>
															{categorySkills.map(skill => {
																const SkillIcon = skill.icon
																const isSelected = selectedSkills.includes(skill.id)
																return (
																	<button
																		key={skill.id}
																		onClick={() => toggleSkill(skill.id)}
																		className={`p-3 md:p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
																			isSelected
																				? 'border-primary bg-primary/5 shadow-sm'
																				: 'border-border hover:border-primary/50 hover:bg-accent'
																		}`}
																	>
																		<div className='flex items-start justify-between mb-2'>
																			<SkillIcon
																				className={`w-5 h-5 md:w-6 md:h-6 ${
																					isSelected ? 'text-primary' : 'text-muted-foreground'
																				}`}
																			/>
																			{isSelected && (
																				<CheckCircle2 className='w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0' />
																			)}
																		</div>
																		<p
																			className={`text-sm md:text-base font-medium mb-1 ${
																				isSelected ? 'text-primary' : ''
																			}`}
																		>
																			{skill.name}
																		</p>
																		<p className='text-xs md:text-sm text-muted-foreground'>
																			{skill.jobCount} {t('skills.jobs')}
																		</p>
																	</button>
																)
															})}
														</div>
													</div>
												)}
											</div>
										)
									})}
								</div>

								{/* Add More Categories Button */}
								<Button
									variant='outline'
									onClick={() => setWizardStep('categories')}
									className='w-full h-11 md:h-12 cursor-pointer'
								>
									Add more categories
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer */}
			{wizardStep === 'skills' && (
				<div className='p-3 md:p-4 lg:p-6 border-t'>
					<div className='max-w-4xl mx-auto'>
						<Button
							onClick={handleContinue}
							className='w-full h-11 md:h-12 cursor-pointer'
							disabled={selectedSkills.length === 0}
						>
							{t('common.continue')}
							<ArrowRight className='w-4 h-4 md:w-5 md:h-5 ml-2' />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
