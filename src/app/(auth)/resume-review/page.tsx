'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Check, FileText, Shield } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'

interface ResumeData {
	firstName: string
	lastName: string
	dateOfBirth: string
	username: string
	email: string
	skills?: string[]
	experience?: Array<{
		title: string
		company: string
		duration: string
	}>
}

export default function ResumeReview() {
	const t = useTranslations()
	const router = useRouter()
	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber)
	const [resumeData, setResumeData] = useState<ResumeData | null>(null)
	const [editMode, setEditMode] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		email: '',
	})

	useEffect(() => {
		// Load resume data from localStorage
		const savedData = localStorage.getItem('resumeData')
		if (savedData) {
			const data = JSON.parse(savedData)
			setResumeData(data)
			setFormData({
				firstName: data.firstName || '',
				lastName: data.lastName || '',
				dateOfBirth: data.dateOfBirth || '',
				email: data.email || '',
			})
		} else {
			// If no data, redirect back to upload
			router.push('/resume-upload')
		}
	}, [router])

	const handleSave = () => {
		if (!resumeData) return

		const updatedData = {
			...resumeData,
			...formData,
		}

		// Save to localStorage
		localStorage.setItem('resumeData', JSON.stringify(updatedData))
		setResumeData(updatedData)
		setEditMode(false)
	}

	const handleVerifyAadhaar = () => {
		// Set onboarding flow context so aadhaar-review knows to return here
		localStorage.setItem('onboardingFlow', 'resume')
		router.push('/aadhaar-scan')
	}

	const handleContinue = () => {
		// Navigate to skills wizard
		router.push('/skills-wizard')
	}

	if (!resumeData) {
		return (
			<div className='min-h-screen bg-background flex items-center justify-center'>
				<p className='text-muted-foreground'>Loading...</p>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.push('/resume-upload')}
					className='mr-2 cursor-pointer'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<div>
					<h1 className='text-lg font-semibold'>{t('resume.reviewTitle')}</h1>
					<p className='text-xs text-muted-foreground'>{t('resume.reviewSubtitle')}</p>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-4 sm:p-6'>
				<div className='max-w-md mx-auto'>
					<div className='flex items-center gap-3 mb-6'>
						<FileText className='w-8 h-8 text-primary' />
						<h2 className='text-xl font-bold'>{t('resume.reviewDesc')}</h2>
					</div>

					<div className='space-y-4 mb-6'>
						{/* First Name */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-muted-foreground'>
								{t('resume.firstName')}
							</label>
							{editMode ? (
								<Input
									value={formData.firstName}
									onChange={e => setFormData({ ...formData, firstName: e.target.value })}
									className='h-11 text-base'
								/>
							) : (
								<div className='p-4 bg-muted rounded-lg'>
									<p className='font-semibold'>{resumeData.firstName}</p>
								</div>
							)}
						</div>

						{/* Last Name */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-muted-foreground'>
								{t('resume.lastName')}
							</label>
							{editMode ? (
								<Input
									value={formData.lastName}
									onChange={e => setFormData({ ...formData, lastName: e.target.value })}
									className='h-11 text-base'
								/>
							) : (
								<div className='p-4 bg-muted rounded-lg'>
									<p className='font-semibold'>{resumeData.lastName}</p>
								</div>
							)}
						</div>

						{/* Date of Birth */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-muted-foreground'>
								{t('resume.dateOfBirth')}
							</label>
							{editMode ? (
								<Input
									type='date'
									value={formData.dateOfBirth}
									onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
									className='h-11 text-base'
								/>
							) : (
								<div className='p-4 bg-muted rounded-lg'>
									<p className='font-semibold'>{resumeData.dateOfBirth}</p>
								</div>
							)}
						</div>

						{/* Email */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-muted-foreground'>
								{t('resume.email')}
							</label>
							{editMode ? (
								<Input
									type='email'
									value={formData.email}
									onChange={e => setFormData({ ...formData, email: e.target.value })}
									className='h-11 text-base'
								/>
							) : (
								<div className='p-4 bg-muted rounded-lg'>
									<p className='font-semibold'>{resumeData.email}</p>
								</div>
							)}
						</div>

						{/* Phone Number (Read-only) */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-muted-foreground'>
								{t('resume.phoneNumber')}
							</label>
							<div className='p-4 bg-muted/50 rounded-lg border border-border'>
								<p className='font-semibold text-muted-foreground'>{phoneNumber || resumeData.username}</p>
							</div>
						</div>

						{/* Skills Preview */}
						{resumeData.skills && resumeData.skills.length > 0 && (
							<div className='space-y-2'>
								<label className='text-sm font-medium text-muted-foreground'>
									{t('resume.detectedSkills')}
								</label>
								<div className='p-4 bg-muted rounded-lg'>
									<div className='flex flex-wrap gap-2'>
										{resumeData.skills.map((skill, index) => (
											<span
												key={index}
												className='px-3 py-1 bg-primary/10 text-primary text-sm rounded-full'
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Experience Preview */}
						{resumeData.experience && resumeData.experience.length > 0 && (
							<div className='space-y-2'>
								<label className='text-sm font-medium text-muted-foreground'>
									{t('resume.experience')}
								</label>
								<div className='space-y-3'>
									{resumeData.experience.map((exp, index) => (
										<div key={index} className='p-4 bg-muted rounded-lg'>
											<p className='font-semibold'>{exp.title}</p>
											<p className='text-sm text-muted-foreground'>{exp.company}</p>
											<p className='text-xs text-muted-foreground mt-1'>{exp.duration}</p>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className='space-y-3'>
						{editMode ? (
							<div className='flex gap-3'>
								<Button onClick={handleSave} className='flex-1 h-12 cursor-pointer'>
									<Check className='w-5 h-5 mr-2' />
									{t('resume.save')}
								</Button>
								<Button
									onClick={() => {
										setEditMode(false)
										setFormData({
											firstName: resumeData.firstName || '',
											lastName: resumeData.lastName || '',
											dateOfBirth: resumeData.dateOfBirth || '',
											email: resumeData.email || '',
										})
									}}
									variant='outline'
									className='h-12 px-4 cursor-pointer'
								>
									{t('resume.cancel')}
								</Button>
							</div>
						) : (
							<>
								<Button onClick={handleContinue} className='w-full h-12 cursor-pointer'>
									{t('resume.continue')}
								</Button>
								<Button
									onClick={() => setEditMode(true)}
									variant='outline'
									className='w-full h-12 cursor-pointer'
								>
									<Edit2 className='w-5 h-5 mr-2' />
									{t('resume.edit')}
								</Button>
								<Button
									onClick={handleVerifyAadhaar}
									variant='outline'
									className='w-full h-12 cursor-pointer border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
								>
									<Shield className='w-5 h-5 mr-2' />
									{t('resume.verifyAadhaar')}
								</Button>
								<Button
									onClick={() => router.push('/resume-upload')}
									variant='ghost'
									className='w-full cursor-pointer'
								>
									{t('resume.uploadDifferent')}
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
