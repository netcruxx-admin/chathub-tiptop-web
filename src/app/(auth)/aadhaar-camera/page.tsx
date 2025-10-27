'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, RotateCcw, Upload } from 'lucide-react'
import Tesseract from 'tesseract.js'

export default function AadhaarCamera() {
	const t = useTranslations()
	const router = useRouter()
	const [progress, setProgress] = useState(0)
	const [isScanning, setIsScanning] = useState(false)
	const [isCameraActive, setIsCameraActive] = useState(false)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [error, setError] = useState('')
	const [isMobile, setIsMobile] = useState(false)
	const [ocrProgress, setOcrProgress] = useState(0)
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Detect if device is mobile
	useEffect(() => {
		const checkIfMobile = () => {
			const userAgent = navigator.userAgent || navigator.vendor
			const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
			return mobileRegex.test(userAgent.toLowerCase())
		}
		setIsMobile(checkIfMobile())
	}, [])

	// Start camera when component mounts (only on mobile)
	useEffect(() => {
		if (isMobile) {
			startCamera()
		}
		return () => {
			// Cleanup: stop camera when component unmounts
			if (stream) {
				stream.getTracks().forEach(track => track.stop())
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobile])

	const startCamera = async () => {
		try {
			setError('')

			// Check if getUserMedia is supported
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				setError('Camera is not supported on this device or browser.')
				return
			}

			// Request camera access
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment', // Use back camera on mobile devices
					width: { ideal: 1920 },
					height: { ideal: 1080 },
				},
			})

			setStream(mediaStream)
			setIsCameraActive(true)

			// Attach stream to video element
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream
				videoRef.current.play()
			}
		} catch (err: any) {
			console.error('Camera access error:', err)
			let errorMessage = 'Unable to access camera. '

			if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
				errorMessage += 'Please allow camera permissions in your browser settings.'
			} else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
				errorMessage += 'No camera found on this device.'
			} else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
				errorMessage += 'Camera is already in use by another application.'
			} else {
				errorMessage += 'Please check your camera permissions.'
			}

			setError(errorMessage)
		}
	}

	// Extract Aadhaar details using regex patterns
	const extractAadhaarDetails = (rawText: string) => {
		console.log('=== RAW OCR TEXT ===')
		console.log(rawText)
		console.log('===================')

		// Clean the text - remove extra spaces and special characters
		const cleanText = rawText.replace(/[^\w\s\/:.-]/g, ' ').replace(/\s+/g, ' ')
		const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean)

		console.log('All Lines:', lines)

		// Extract Aadhaar Number: 12 digits (may have spaces)
		const aadhaarMatch = rawText.match(/\d{4}\s?\d{4}\s?\d{4}/)
		const aadhaarNumber = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : 'Not found'

		// Extract Date of Birth
		let dobMatch = rawText.match(/DOB\s*[:\-]?\s*([\d\/\-\.]+)/i)
		if (!dobMatch) {
			dobMatch = rawText.match(/YOB\s*[:\-]?\s*([\d\/\-\.]+)/i)
		}
		if (!dobMatch) {
			dobMatch = rawText.match(/\b(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})\b/)
		}
		const dob = dobMatch ? (dobMatch[1] && dobMatch[2] && dobMatch[3] ? `${dobMatch[1]}/${dobMatch[2]}/${dobMatch[3]}` : dobMatch[0]) : 'Not found'

		// Extract Gender - look more carefully
		const genderMatch = rawText.match(/\b(Male|Female|MALE|FEMALE|Transgender|TRANSGENDER|पुरुष|महिला)\b/i)
		let gender = ''
		if (genderMatch) {
			const g = genderMatch[0].toLowerCase()
			if (g === 'male' || g === 'पुरुष') gender = 'male'
			else if (g === 'female' || g === 'महिला') gender = 'female'
			else if (g.includes('trans')) gender = 'transgender'
		}

		// Extract Name - using multiple strategies
		let fullName = ''

		// Strategy 1: Look for common name patterns (2-3 capitalized words in sequence)
		const namePatterns = [
			// Pattern: "FirstName LastName" or "FirstName MiddleName LastName"
			/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g,
		]

		const potentialNames: string[] = []
		for (const pattern of namePatterns) {
			const matches = rawText.matchAll(pattern)
			for (const match of matches) {
				const name = match[1].trim()
				// Filter out common Aadhaar text
				if (!name.match(/Government|India|Aadhaar|Unique|Identification|Authority|Address|Male|Female/i)) {
					potentialNames.push(name)
				}
			}
		}

		console.log('Potential Names:', potentialNames)

		// Pick the first valid name (usually appears first on card)
		if (potentialNames.length > 0) {
			fullName = potentialNames[0]
		}

		// Strategy 2: Look for all-caps name line
		if (!fullName) {
			const capsLine = lines.find(line =>
				/^[A-Z\s]+$/.test(line) &&
				line.length > 5 &&
				line.length < 50 &&
				!line.match(/GOVERNMENT|INDIA|AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY|MALE|FEMALE/i)
			)
			if (capsLine) fullName = capsLine
		}

		if (!fullName || fullName === 'Not found') {
			fullName = 'Not found'
		}

		// Clean up name
		fullName = fullName.replace(/\s+/g, ' ').trim()

		// Extract first and last name
		const nameParts = fullName.split(/\s+/).filter(Boolean)
		const firstName = nameParts[0] || 'Not found'
		const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

		// Extract Address - find lines that look like addresses
		let address = ''

		// Strategy 1: Look for "Address:" label
		const addressMatch = rawText.match(/Address\s*[:\-]?\s*(.+?)(?=\n|$)/i)
		if (addressMatch) {
			address = addressMatch[1].trim()
		}

		// Strategy 2: Find lines with typical address characteristics
		if (!address) {
			const addressLines = lines.filter(line => {
				// Skip if it's the name
				if (fullName !== 'Not found' && line.includes(fullName)) return false
				// Skip if contains Aadhaar number
				if (line.match(/\d{4}\s?\d{4}\s?\d{4}/)) return false
				// Skip if contains DOB
				if (dob !== 'Not found' && line.includes(dob)) return false
				// Skip common headers
				if (line.match(/GOVERNMENT|INDIA|AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY/i)) return false
				// Must be reasonably long
				if (line.length < 10) return false
				// Should contain letters and possibly numbers
				return /[a-zA-Z]/.test(line) && line.length > 15
			})

			console.log('Potential Address Lines:', addressLines)

			// Take first 2-3 lines as address
			if (addressLines.length > 0) {
				address = addressLines.slice(0, 3).join(', ')
			}
		}

		// Clean address - remove the name if it got included
		if (address && fullName !== 'Not found') {
			address = address.replace(fullName, '').replace(/^[,\s]+|[,\s]+$/g, '').trim()
		}

		console.log('=== EXTRACTED DETAILS ===')
		console.log({
			fullName,
			firstName,
			lastName,
			dob,
			gender: gender || 'Not detected',
			aadhaarNumber,
			address: address || 'Not found'
		})
		console.log('========================')

		return {
			firstName,
			lastName,
			name: fullName,
			dob,
			gender,
			address: address || 'Not found',
			aadhaarNumber,
		}
	}

	const processImage = async (imageData: string) => {
		// Start processing animation
		setIsScanning(true)
		setOcrProgress(0)

		try {
			// Perform OCR using Tesseract.js
			const result = await Tesseract.recognize(
				imageData,
				'eng', // Language
				{
					logger: (m) => {
						// Update progress
						if (m.status === 'recognizing text') {
							setOcrProgress(Math.round(m.progress * 100))
						}
					}
				}
			)

			const extractedText = result.data.text
			console.log('Extracted Text:', extractedText)

			// Extract Aadhaar details from the recognized text
			const aadhaarData = extractAadhaarDetails(extractedText)
			console.log('Extracted Aadhaar Data:', aadhaarData)

			// Add image data
			const finalData = {
				...aadhaarData,
				imageData,
			}

			// Save scanned data to localStorage
			localStorage.setItem('aadhaarData', JSON.stringify(finalData))
			setIsScanning(false)

			// Navigate to review page
			router.push('/aadhaar-review')
		} catch (error) {
			console.error('OCR Error:', error)
			setError('Failed to process image. Please try again.')
			setIsScanning(false)
		}
	}

	const captureImage = () => {
		if (!videoRef.current || !canvasRef.current) return

		const video = videoRef.current
		const canvas = canvasRef.current

		// Set canvas dimensions to match video
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight

		// Draw video frame to canvas
		const ctx = canvas.getContext('2d')
		if (ctx) {
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

			// Get image data
			const imageData = canvas.toDataURL('image/jpeg', 0.8)

			// Stop camera
			if (stream) {
				stream.getTracks().forEach(track => track.stop())
			}
			setIsCameraActive(false)

			// Process the image with OCR
			processImage(imageData)
		}
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		// Stop camera if active
		if (stream) {
			stream.getTracks().forEach(track => track.stop())
		}
		setIsCameraActive(false)

		// Read the file
		const reader = new FileReader()
		reader.onload = (e) => {
			const imageData = e.target?.result as string
			processImage(imageData)
		}
		reader.readAsDataURL(file)
	}

	const retakePhoto = () => {
		setProgress(0)
		setOcrProgress(0)
		setIsScanning(false)
		startCamera()
	}

	return (
		<div className='min-h-screen bg-black flex flex-col'>
			<div className='p-4 flex items-center'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => {
						if (stream) {
							stream.getTracks().forEach(track => track.stop())
						}
						router.back()
					}}
					className='mr-2 text-white hover:bg-white/10 cursor-pointer'
				>
					<ArrowLeft className='w-5 h-5' />
				</Button>
				<h1 className='text-lg font-semibold text-white'>
					{isMobile ? t('aadhaar.scanningTitle') : 'Upload Aadhaar Card'}
				</h1>
			</div>

			<div className='flex-1 flex flex-col items-center justify-center p-6'>
				{error && (
					<div className='w-full max-w-sm mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg'>
						<p className='text-white text-sm text-center'>{error}</p>
						{isMobile && (
							<Button
								onClick={startCamera}
								className='w-full mt-2 cursor-pointer'
								variant='outline'
							>
								Retry Camera
							</Button>
						)}
					</div>
				)}

				{/* Mobile: Camera View */}
				{isMobile ? (
					<>
						<div className='relative w-full max-w-sm aspect-[3/2] border-4 border-white/50 rounded-lg overflow-hidden bg-black'>
							{isCameraActive ? (
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className='w-full h-full object-cover'
								/>
							) : (
								<>
									<div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse' />
									<Camera className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/30' />
								</>
							)}

							{/* Overlay guide for Aadhaar card positioning */}
							{isCameraActive && (
								<div className='absolute inset-0 pointer-events-none'>
									<div className='absolute inset-4 border-2 border-dashed border-white/50 rounded-lg' />
									<p className='absolute bottom-2 left-0 right-0 text-white text-xs text-center'>
										Position Aadhaar card within the frame
									</p>
								</div>
							)}
						</div>

						<p className='text-white text-center mt-6 mb-4'>
							{isCameraActive
								? 'Align your Aadhaar card within the frame and capture'
								: t('aadhaar.scanningDesc')}
						</p>
					</>
				) : (
					/* Desktop: Upload View */
					<div className='w-full max-w-md'>
						<div className='relative w-full aspect-[3/2] border-4 border-dashed border-white/50 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center'>
							<Upload className='w-24 h-24 text-white/30' />
						</div>
						<p className='text-white text-center mt-6 mb-4'>
							Upload an image of your Aadhaar card to extract information
						</p>
					</div>
				)}

				{/* Hidden canvas for image capture */}
				<canvas ref={canvasRef} className='hidden' />

				{/* Hidden file input */}
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					capture={isMobile ? 'environment' : undefined}
					onChange={handleFileUpload}
					className='hidden'
				/>

				{/* Actions */}
				{isScanning ? (
					<div className='w-full max-w-sm'>
						<div className='bg-white/20 rounded-full h-2 overflow-hidden'>
							<div
								className='bg-white h-full transition-all duration-300'
								style={{ width: `${ocrProgress}%` }}
							/>
						</div>
						<p className='text-white text-sm text-center mt-2'>
							Processing with OCR... {ocrProgress}%
						</p>
					</div>
				) : (
					<div className='w-full max-w-sm mt-6'>
						{/* Mobile: Camera Controls */}
						{isMobile && isCameraActive ? (
							<div className='flex gap-4'>
								<Button
									onClick={captureImage}
									className='flex-1 bg-white text-black hover:bg-white/90 cursor-pointer'
									size='lg'
								>
									<Camera className='w-5 h-5 mr-2' />
									Capture
								</Button>
								<Button
									onClick={retakePhoto}
									variant='outline'
									className='flex-1 text-white border-white hover:bg-white/10 cursor-pointer'
									size='lg'
								>
									<RotateCcw className='w-5 h-5 mr-2' />
									Retake
								</Button>
							</div>
						) : (
							/* Desktop: Upload Button */
							<Button
								onClick={() => fileInputRef.current?.click()}
								className='w-full bg-white text-black hover:bg-white/90 cursor-pointer'
								size='lg'
							>
								<Upload className='w-5 h-5 mr-2' />
								Choose File to Upload
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
