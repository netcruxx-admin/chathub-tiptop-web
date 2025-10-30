'use client'

import { Button } from '@/components/ui/button'
import {
	ArrowLeft,
	Camera,
	CheckCircle2,
	Shield,
	Sparkles,
	Upload,
	User2,
	Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Tesseract from 'tesseract.js'
import { updateAadhaarData } from '@/redux/slices/formSlice' // <-- Import Redux action

// Helper function to extract details (This is the full logic from your AadhaarCamera.js)
const extractAadhaarDetails = (rawText: string) => {
	console.log('🔍 === RAW OCR TEXT START ===')
	console.log(rawText)
	console.log('🔍 === RAW OCR TEXT END ===')

	const cleanText = rawText.replace(/[^\w\s\/:.-]/g, ' ').replace(/\s+/g, ' ')
	const lines = cleanText
		.split('\n')
		.map(l => l.trim())
		.filter(Boolean)
	console.log('📜 OCR Lines:', lines)

	// Aadhaar number
	const aadhaarMatch = rawText.match(/\d{4}\s?\d{4}\s?\d{4}/)
	const aadhaarNumber = aadhaarMatch
		? aadhaarMatch[0].replace(/\s/g, '')
		: 'Not found'

	// DOB (loose)
	const dobMatch =
		rawText.match(
			/DOB\s*[:\-]?\s*([\d]{1,2}[\/\-\.][\d]{1,2}[\/\-\.][\d]{2,4})/i
		) || rawText.match(/\b(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})\b/)
	const dob = dobMatch
		? dobMatch[1] && dobMatch[2] && dobMatch[3]
			? `${dobMatch[1]}/${dobMatch[2]}/${dobMatch[3]}`
			: dobMatch[0]
		: 'Not found'

	// Gender
	const genderMatch = rawText.match(
		/\b(Male|Female|MALE|FEMALE|Transgender|TRANSGENDER|पुरुष|महिला)\b/i
	)
	const gender = genderMatch ? genderMatch[0].toLowerCase() : 'Not found'

	// ADDRESS (try explicit label first)
	const addressMatch = rawText.match(/Address\s*[:\-]?\s*(.+?)(?=\n|$)/i)
	let address = addressMatch ? addressMatch[1].trim() : 'Not found'

	// NAME extraction — improved heuristic:
	// 1) Prefer a line immediately before DOB
	// 2) Or a line that contains S/O, D/O, W/O or similar (the name may be after S/O)
	// 3) Or a line that appears after the "Government" header (common layout)
	// 4) Fallback to stricter regex matches (2-4 capitalized words), filter junk
	let fullName = 'Not found'

	// helper: find index of line containing DOB/date
	const dateLineIndex = lines.findIndex(line =>
		/\bDOB\b|\bYOB\b|\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/i.test(line)
	)
	if (dateLineIndex > 0) {
		// look at the previous 1-2 lines for a name candidate
		for (let i = dateLineIndex - 1; i >= Math.max(0, dateLineIndex - 2); i--) {
			const candidate = lines[i]
			if (
				candidate &&
				candidate.length > 3 &&
				/[A-Za-z]/.test(candidate) &&
				!/GOVERNMENT|INDIA|AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY|AGE|YEAR|DOB/i.test(
					candidate
				)
			) {
				fullName = candidate
				console.log('🔎 Name found by DOB-context:', fullName)
				break
			}
		}
	}

	// If not found, search for S/O, D/O pattern lines
	if (fullName === 'Not found') {
		const soLine = lines.find(line =>
			/\bS\/O\b|\bSO\b|\bD\/O\b|\bDO\b|\bW\/O\b|\bWO\b/i.test(line)
		)
		if (soLine) {
			// Sometimes the format is "Name S/O FatherName" or "S/O: FatherName" — try to extract name portion
			// If S/O appears after a name (common), take the portion before S/O
			const beforeSO = soLine
				.split(/\bS\/O\b|\bSO\b|\bD\/O\b|\bDO\b|\bW\/O\b|\bWO\b/i)[0]
				.trim()
			if (beforeSO && beforeSO.length > 3 && !/^\d+$/.test(beforeSO)) {
				fullName = beforeSO
				console.log('🔎 Name found on S/O line (before S/O):', fullName)
			} else {
				// if nothing before, maybe the actual name is the line above
				const idx = lines.indexOf(soLine)
				if (idx > 0 && lines[idx - 1].length > 3) {
					fullName = lines[idx - 1]
					console.log('🔎 Name found as line above S/O line:', fullName)
				}
			}
		}
	}

	// If still not found, look for header "Government" and take a line after it
	if (fullName === 'Not found') {
		const govIndex = lines.findIndex(line =>
			/GOVERNMENT\s+OF\s+INDIA|GOVERNMENT|UNIQUE\s+IDENTIFICATION/i.test(line)
		)
		if (govIndex >= 0 && lines[govIndex + 1]) {
			const candidate = lines[govIndex + 1].trim()
			if (
				candidate.length > 3 &&
				!/AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY/i.test(candidate)
			) {
				fullName = candidate
				console.log('🔎 Name found after Government header:', fullName)
			}
		}
	}

	// Final fallback: stricter regex; block common junk like Age, DOB, Year
	if (fullName === 'Not found') {
		const strictMatches = [
			...cleanText.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g),
		]
			.map(m => m[1])
			.filter(
				n =>
					!n.match(
						/Government|India|Aadhaar|Authority|Age|Year|DOB|Male|Female|Address|Age As/i
					)
			)

		console.log('🧾 Strict Potential Names:', strictMatches)

		// prefer matches of 2 or 3 words
		const twoOrThree = strictMatches.find(
			n =>
				n.trim().split(/\s+/).length >= 2 && n.trim().split(/\s+/).length <= 3
		)
		if (twoOrThree) {
			fullName = twoOrThree
			console.log('🔎 Name chosen from strictMatches (2-3 words):', fullName)
		} else if (strictMatches.length > 0) {
			fullName = strictMatches[0]
			console.log('🔎 Name chosen from strictMatches (fallback):', fullName)
		}
	}

	// Clean up name
	fullName = fullName.replace(/\s+/g, ' ').trim()
	if (!fullName) fullName = 'Not found'

	// If address still 'Not found', attempt address heuristics: long lines that contain locality keywords or numbers
	if (address === 'Not found') {
		const addrCandidates = lines.filter(line => {
			if (line.length < 10) return false
			if (
				/\bPIN\b|\bPINCODE\b|\b\d{6}\b|Near|Road|Lane|Street|Sector|Village|Taluka|District|Dist\b/i.test(
					line
				)
			)
				return true
			return /[0-9]/.test(line) && /[A-Za-z]/.test(line)
		})
		if (addrCandidates.length > 0) {
			address = addrCandidates.slice(0, 3).join(', ')
			console.log('🔎 Address heuristics picked:', address)
		}
	}

	// Compute first and last name safely (don't crash if name missing)
	const nameParts =
		fullName && fullName !== 'Not found'
			? fullName.split(/\s+/).filter(Boolean)
			: []
	const firstName = nameParts[0] || 'Not found'
	// This is the logic from your original file:
	const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

	console.log('📋 Extracted Details:', {
		fullName,
		firstName,
		lastName,
		dob,
		gender,
		aadhaarNumber,
		address,
	})

	return {
		fullName,
		firstName,
		lastName,
		dob,
		gender,
		aadhaarNumber,
		address,
	}
}

export default function SignUpChoice() {
	const t = useTranslations()
	const router = useRouter()
	const dispatch = useDispatch() // <-- Add Redux dispatch

	const [isMobile, setIsMobile] = useState(false)
	const [isCapturing, setIsCapturing] = useState(false)
	const [isScanning, setIsScanning] = useState(false)
	const [scanProgress, setScanProgress] = useState(0)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)

	useEffect(() => {
		const checkMobile = () => {
			const isTouchDevice =
				'ontouchstart' in window || navigator.maxTouchPoints > 0
			const isSmallScreen = window.innerWidth < 768
			setIsMobile(isTouchDevice && isSmallScreen)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const handleAadhaarOption = () => {
		if (isMobile) {
			startCamera()
		} else {
			fileInputRef.current?.click()
		}
	}

	const startCamera = async () => {
		try {
			setIsCapturing(true)
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
			})
			setStream(mediaStream)
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream
			}
		} catch (error) {
			console.error('Error accessing camera:', error)
			alert('Unable to access camera. Please use upload option.')
			setIsCapturing(false)
		}
	}

	const capturePhoto = () => {
		if (!videoRef.current) return

		const canvas = document.createElement('canvas')
		canvas.width = videoRef.current.videoWidth
		canvas.height = videoRef.current.videoHeight
		const ctx = canvas.getContext('2d')
		if (ctx) {
			ctx.drawImage(videoRef.current, 0, 0)
			canvas.toBlob(blob => {
				if (blob) {
					const file = new File([blob], 'aadhaar.jpg', { type: 'image/jpeg' })
					processAadhaarFile(file)
				}
			}, 'image/jpeg')
		}

		if (stream) {
			stream.getTracks().forEach(track => track.stop())
			setStream(null)
		}
		setIsCapturing(false)
	}

	// Handle file input from desktop
	const handleFileInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (file) {
			processAadhaarFile(file)
		}
	}

	// Updated function to use Tesseract
	const processAadhaarFile = async (file: File) => {
		if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
			alert('Please upload an image or PDF file')
			return
		}

		setIsScanning(true)
		setScanProgress(0)

		try {
			const result = await Tesseract.recognize(file, 'eng', {
				logger: m => {
					if (m.status === 'recognizing text') {
						const progress = Math.round(m.progress * 100)
						setScanProgress(progress)
						// console.log(`📈 OCR Progress: ${progress}%`)
					}
				},
			})

			// Extract data using the robust function
			const extractedData = extractAadhaarDetails(result.data.text)

			// Dispatch data to Redux
			dispatch(updateAadhaarData(extractedData))

			// Stop scanning UI and navigate
			setIsScanning(false)
			router.push('/name-collection') // Navigate to the form
		} catch (error) {
			console.error('❌ OCR Error:', error)
			alert('Failed to process image. Please try again.')
			setIsScanning(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col'>
			{/* Header */}
			<div className='p-4 border-b bg-white flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
					className='mr-2'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<h1 className='text-lg font-semibold'>{t('signUpChoice.header')}</h1>
			</div>

			<div className='flex-1 overflow-y-auto p-4'>
				<div className='max-w-md mx-auto space-y-4'>
					{/* Main heading with context */}
					<div className='text-center space-y-2 pt-2 mb-10'>
						<div className='w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg'>
							<User2 className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
						</div>
						<h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
							{t('signUpChoice.title')}
						</h2>
						<p className='text-gray-600 text-sm px-2'>
							{t('signUpChoice.subtitle')}
						</p>
					</div>

					{/* Aadhaar Option - Recommended */}
					<div className='relative'>
						<div className='absolute -top-3 left-1/2 -translate-x-1/2 z-10'>
							<span className='bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1'>
								<Sparkles className='w-3 h-3' />
								{t('signUpChoice.recommendedBadge')}
							</span>
						</div>
						<button
							onClick={handleAadhaarOption}
							className='w-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-4 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]'
						>
							<div className='flex items-start gap-3'>
								<div className='w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md'>
									{isMobile ? (
										<Camera className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
									) : (
										<Upload className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
									)}
								</div>
								<div className='flex-1 text-left min-w-0'>
									<h3 className='font-bold text-base mb-1 text-gray-900'>
										{t('signUpChoice.aadhaarTitle')}
									</h3>
									<p className='text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed'>
										{t('signUpChoice.aadhaarDesc')}
									</p>
									<div className='space-y-1'>
										<div className='flex items-center gap-2 text-sm text-gray-700'>
											<CheckCircle2 className='w-3.5 h-3.5 text-green-600 flex-shrink-0' />
											<span className='leading-tight'>
												{t('signUpChoice.aadhaarBenefit1')}
											</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-gray-700'>
											<Zap className='w-3.5 h-3.5 text-yellow-600 flex-shrink-0' />
											<span className='leading-tight'>
												{t('signUpChoice.aadhaarBenefit2')}
											</span>
										</div>
										<div className='flex items-center gap-2 text-sm text-gray-700'>
											<Shield className='w-3.5 h-3.5 text-blue-600 flex-shrink-0' />
											<span className='leading-tight'>
												{t('signUpChoice.aadhaarBenefit3')}
											</span>
										</div>
									</div>
								</div>
							</div>
						</button>
					</div>

					{/* Divider */}
					<div className='relative py-2'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300'></div>
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-4 bg-white text-gray-500 font-medium'>
								{t('signUpChoice.divider')}
							</span>
						</div>
					</div>

					{/* Manual Entry Option */}
					<button
						onClick={() => router.push('/name-collection')}
						className='w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-gray-300'
					>
						<div className='flex items-start gap-3'>
							<div className='w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0'>
								<User2 className='w-5 h-5 sm:w-6 sm:h-6 text-gray-600' />
							</div>
							<div className='flex-1 text-left min-w-0'>
								<h3 className='font-bold text-base mb-1 text-gray-900'>
									{t('signUpChoice.manualTitle')}
								</h3>
								<p className='text-sm text-gray-600 leading-relaxed'>
									{t('signUpChoice.manualDesc')}
								</p>
							</div>
						</div>
					</button>
				</div>
			</div>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*,.pdf'
				onChange={handleFileInputChange} // <-- Wire up the handler
				className='hidden'
			/>

			{/* Camera Modal */}
			{isCapturing && (
				<div className='fixed inset-0 bg-black z-50 flex flex-col'>
					<div className='p-4 flex items-center justify-between'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => {
								if (stream) {
									stream.getTracks().forEach(track => track.stop())
									setStream(null)
								}
								setIsCapturing(false)
							}}
							className='text-white hover:bg-white/10'
						>
							<ArrowLeft className='w-5 h-5' />
						</Button>
						<h1 className='text-lg font-semibold text-white'>
							Aadhaar scan karein
						</h1>
						<div className='w-10' />
					</div>

					<div className='flex-1 flex flex-col items-center justify-center p-6'>
						<div className='relative w-full max-w-sm aspect-[3/2] border-4 border-white/50 rounded-lg overflow-hidden'>
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className='w-full h-full object-cover'
							/>
						</div>
						<p className='text-white text-center mt-6 mb-4'>
							Aadhaar card ko frame ke andar rakhein
						</p>
						{stream && (
							<Button
								onClick={capturePhoto}
								size='lg'
								className='bg-green-600 hover:bg-green-700'
							>
								<Camera className='w-5 h-5 mr-2' />
								Capture karein
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Scanning Progress */}
			{isScanning && (
				<div className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6'>
					<div className='bg-white rounded-2xl p-8 max-w-sm w-full text-center'>
						<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Upload className='w-8 h-8 text-green-600 animate-pulse' />
						</div>
						<h3 className='text-xl font-bold mb-2'>
							Aadhaar scan ho raha hai...
						</h3>
						<p className='text-gray-600 text-sm mb-4'>Kripya wait karein</p>
						<div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
							<div
								className='bg-green-600 h-full transition-all duration-300'
								style={{ width: `${scanProgress}%` }}
							/>
						</div>
						<p className='text-xs text-gray-500 mt-2'>{scanProgress}%</p>
					</div>
				</div>
			)}
		</div>
	)
}
