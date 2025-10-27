'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2 } from 'lucide-react'

export default function ResumeUpload() {
	const t = useTranslations()
	const router = useRouter()
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)
	const [parsed, setParsed] = useState(false)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
			handleUpload(e.target.files[0])
		}
	}

	const handleUpload = async (uploadedFile: File) => {
		setUploading(true)

		// Simulate upload and parsing
		setTimeout(() => {
			// Mock parsed data from resume
			const phoneNumber = localStorage.getItem('phoneNumber') || ''
			const mockResumeData = {
				firstName: 'Rahul',
				lastName: 'Kumar',
				dateOfBirth: '1995-05-15',
				username: phoneNumber,
				email: `${phoneNumber}@tiptopmail.com`,
				skills: ['JavaScript', 'React', 'Node.js'],
				experience: [
					{
						title: 'Software Developer',
						company: 'Tech Company',
						duration: '2020-2023',
					},
				],
			}

			// Save parsed data to localStorage
			localStorage.setItem('resumeData', JSON.stringify(mockResumeData))

			setUploading(false)
			setParsed(true)
		}, 3000)
	}

	const handleContinue = () => {
		// Navigate to resume review page
		router.push('/resume-review')
	}

	return (
		<div className='min-h-screen bg-background flex flex-col'>
			<div className='p-4 border-b flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
					className='mr-2 cursor-pointer'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<div>
					<h1 className='text-lg font-semibold'>Resume Upload</h1>
					<p className='text-xs text-muted-foreground'>Upload your resume</p>
				</div>
			</div>

			<div className='flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center'>
				<div className='max-w-lg w-full'>
					{!parsed ? (
						<div className='border-2 border-dashed border-border rounded-xl p-8 text-center'>
							{uploading ? (
								<div className='space-y-4'>
									<Loader2 className='w-16 h-16 mx-auto text-primary animate-spin' />
									<p className='text-lg font-medium'>Uploading and parsing...</p>
								</div>
							) : (
								<>
									<Upload className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
									<p className='text-lg font-medium mb-2'>Drag & drop your resume here</p>
									<p className='text-sm text-muted-foreground mb-4'>or</p>
									<label htmlFor='resume-upload'>
										<Button asChild className='cursor-pointer'>
											<span>
												<FileText className='w-5 h-5 mr-2' />
												Browse Files
											</span>
										</Button>
									</label>
									<input
										id='resume-upload'
										type='file'
										accept='.pdf,.doc,.docx'
										onChange={handleFileChange}
										className='hidden'
									/>
									<p className='text-xs text-muted-foreground mt-4'>PDF, DOC, DOCX supported</p>
									{file && <p className='text-sm mt-2 text-primary'>{file.name}</p>}
								</>
							)}
						</div>
					) : (
						<div className='text-center space-y-6'>
							<CheckCircle className='w-20 h-20 mx-auto text-green-500' />
							<div>
								<h2 className='text-2xl font-bold mb-2'>Resume successfully parsed!</h2>
								<p className='text-muted-foreground'>
									We've extracted your information. You can review and edit it in the next steps.
								</p>
							</div>
							<div className='space-y-3 max-w-md mx-auto'>
								<Button onClick={handleContinue} className='w-full cursor-pointer' size='lg'>
									Continue
								</Button>
								<Button
									onClick={() => {
										setFile(null)
										setParsed(false)
									}}
									variant='outline'
									className='w-full cursor-pointer'
								>
									Upload Different Resume
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
