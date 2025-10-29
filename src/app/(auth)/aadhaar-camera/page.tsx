'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Upload } from 'lucide-react'
import Tesseract from 'tesseract.js'

export default function AadhaarCamera() {
  const t = useTranslations()
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [frontImageData, setFrontImageData] = useState<string | null>(null)
  const [backImageData, setBackImageData] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkIfMobile = () =>
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        (navigator.userAgent || navigator.vendor).toLowerCase()
      )
    setIsMobile(checkIfMobile())
  }, [])

  useEffect(() => {
    if (isMobile) startCamera()
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [isMobile])

  const startCamera = async () => {
    console.log('📸 Starting camera...')
    try {
      setError('')
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera not supported on this device.')
        console.error('❌ Camera not supported on this device.')
        return
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      setStream(mediaStream)
      setIsCameraActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      console.log('✅ Camera started successfully')
    } catch (err: any) {
      console.error('Camera access error:', err)
      setError('Unable to access camera. Please check permissions.')
    }
  }

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
    const aadhaarNumber = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, '') : 'Not found'

    // DOB (loose)
    const dobMatch =
      rawText.match(/DOB\s*[:\-]?\s*([\d]{1,2}[\/\-\.][\d]{1,2}[\/\-\.][\d]{2,4})/i) ||
      rawText.match(/\b(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})\b/)
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
    const dateLineIndex = lines.findIndex(line => /\bDOB\b|\bYOB\b|\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/i.test(line))
    if (dateLineIndex > 0) {
      // look at the previous 1-2 lines for a name candidate
      for (let i = dateLineIndex - 1; i >= Math.max(0, dateLineIndex - 2); i--) {
        const candidate = lines[i]
        if (
          candidate &&
          candidate.length > 3 &&
          /[A-Za-z]/.test(candidate) &&
          !/GOVERNMENT|INDIA|AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY|AGE|YEAR|DOB/i.test(candidate)
        ) {
          fullName = candidate
          console.log('🔎 Name found by DOB-context:', fullName)
          break
        }
      }
    }

    // If not found, search for S/O, D/O pattern lines
    if (fullName === 'Not found') {
      const soLine = lines.find(line => /\bS\/O\b|\bSO\b|\bD\/O\b|\bDO\b|\bW\/O\b|\bWO\b/i.test(line))
      if (soLine) {
        // Sometimes the format is "Name S/O FatherName" or "S/O: FatherName" — try to extract name portion
        // If S/O appears after a name (common), take the portion before S/O
        const beforeSO = soLine.split(/\bS\/O\b|\bSO\b|\bD\/O\b|\bDO\b|\bW\/O\b|\bWO\b/i)[0].trim()
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
      const govIndex = lines.findIndex(line => /GOVERNMENT\s+OF\s+INDIA|GOVERNMENT|UNIQUE\s+IDENTIFICATION/i.test(line))
      if (govIndex >= 0 && lines[govIndex + 1]) {
        const candidate = lines[govIndex + 1].trim()
        if (candidate.length > 3 && !/AADHAAR|UNIQUE|IDENTIFICATION|AUTHORITY/i.test(candidate)) {
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
        .filter(n => !n.match(/Government|India|Aadhaar|Authority|Age|Year|DOB|Male|Female|Address|Age As/i))

      console.log('🧾 Strict Potential Names:', strictMatches)

      // prefer matches of 2 or 3 words
      const twoOrThree = strictMatches.find(n => n.trim().split(/\s+/).length >= 2 && n.trim().split(/\s+/).length <= 3)
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
        if (/\bPIN\b|\bPINCODE\b|\b\d{6}\b|Near|Road|Lane|Street|Sector|Village|Taluka|District|Dist\b/i.test(line)) return true
        return /[0-9]/.test(line) && /[A-Za-z]/.test(line)
      })
      if (addrCandidates.length > 0) {
        address = addrCandidates.slice(0, 3).join(', ')
        console.log('🔎 Address heuristics picked:', address)
      }
    }

    // Compute first and last name safely (don't crash if name missing)
    const nameParts = (fullName && fullName !== 'Not found') ? fullName.split(/\s+/).filter(Boolean) : []
    const firstName = nameParts[0] || 'Not found'
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

    console.log('📋 Extracted Details:', { fullName, firstName, lastName, dob, gender, aadhaarNumber, address })

    return { fullName, firstName, lastName, dob, gender, aadhaarNumber, address }
  }

  const processImage = async (imageData: string, side: 'front' | 'back') => {
    console.log(`🧠 Starting OCR for ${side.toUpperCase()} side...`)
    setIsScanning(true)
    setOcrProgress(0)
    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: m => {
          // OCR progress intentionally not logged (kept as requested)
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100)
            setOcrProgress(progress)
            // console.log(`📈 OCR Progress (${side}): ${progress}%`)
          }
        },
      })
      const extractedText = result.data.text
      console.log(`🧾 OCR Text (${side}):`, extractedText)
      const data = extractAadhaarDetails(extractedText)

      if (side === 'front') {
        setFrontImageData(imageData)
        console.log('✅ Front image processed successfully.')
      } else {
        setBackImageData(imageData)
        console.log('✅ Back image processed successfully.')
      }

      // Save the structured data for each side (now includes firstName & lastName)
      localStorage.setItem(`${side}AadhaarData`, JSON.stringify(data))
      setIsScanning(false)

      if (side === 'front') {
        console.log('➡️ Moving to step 2 (back side)...')
        setStep(2)
        if (isMobile) startCamera()
      } else {
        console.log('🧩 Both sides processed. Combining data...')
        combineFrontAndBackData()
      }
    } catch (error) {
      console.error(`❌ OCR Error (${side}):`, error)
      setError('Failed to process image. Try again.')
      setIsScanning(false)
    }
  }

  const combineFrontAndBackData = () => {
    console.log('🔗 Combining data from both sides...')
    const frontData = JSON.parse(localStorage.getItem('frontAadhaarData') || '{}')
    const backData = JSON.parse(localStorage.getItem('backAadhaarData') || '{}')
    console.log('🧾 Front Data:', frontData)
    console.log('🧾 Back Data:', backData)

    // prefer name from front (but if front is garbage, try back)
    const chosenFullName =
      frontData.fullName && frontData.fullName !== 'Not found' && frontData.fullName.toLowerCase() !== 'age as'
        ? frontData.fullName
        : backData.fullName || frontData.fullName || 'Not found'

    const chosenFirstName =
      (frontData.firstName && frontData.firstName !== 'Not found') ? frontData.firstName :
      (backData.firstName && backData.firstName !== 'Not found') ? backData.firstName : 'Not found'

    const chosenLastName =
      (frontData.lastName && frontData.lastName !== '') ? frontData.lastName :
      (backData.lastName && backData.lastName !== '') ? backData.lastName : ''

    const finalData = {
      fullName: chosenFullName,
      firstName: chosenFirstName,
      lastName: chosenLastName,
      dob: frontData.dob && frontData.dob !== 'Not found' ? frontData.dob : backData.dob || 'Not found',
      gender: frontData.gender && frontData.gender !== 'Not found' ? frontData.gender : backData.gender || 'Not found',
      aadhaarNumber: frontData.aadhaarNumber && frontData.aadhaarNumber !== 'Not found' ? frontData.aadhaarNumber : backData.aadhaarNumber || 'Not found',
      address: backData.address && backData.address !== 'Not found' ? backData.address : frontData.address || 'Not found',
      images: { front: frontImageData, back: backImageData },
    }
    console.log('🎯 Final Combined Data:', finalData)

    localStorage.setItem('aadhaarData', JSON.stringify(finalData))
    router.push('/aadhaar-review')
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return
    console.log(`📸 Capturing ${step === 1 ? 'front' : 'back'} image...`)
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      console.log('🖼️ Captured image data length:', imageData.length)
      if (stream) stream.getTracks().forEach(track => track.stop())
      setIsCameraActive(false)
      processImage(imageData, step === 1 ? 'front' : 'back')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    console.log(`📂 Uploading ${step === 1 ? 'front' : 'back'} side image:`, file.name)
    if (stream) stream.getTracks().forEach(track => track.stop())
    setIsCameraActive(false)
    const reader = new FileReader()
    reader.onload = e => {
      const imageData = e.target?.result as string
      console.log('🧾 File loaded. Starting OCR...')
      processImage(imageData, step === 1 ? 'front' : 'back')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className='min-h-screen bg-black flex flex-col'>
      <div className='p-4 flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => {
            console.log('⬅️ Navigating back...')
            if (stream) stream.getTracks().forEach(track => track.stop())
            router.back()
          }}
          className='mr-2 text-white hover:bg-white/10 cursor-pointer'
        >
          <ArrowLeft className='w-5 h-5' />
        </Button>
        <h1 className='text-lg font-semibold text-white'>
          {step === 1 ? 'Scan Front Side' : 'Scan Back Side'}
        </h1>
      </div>

      <div className='flex-1 flex flex-col items-center justify-center p-6'>
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
                <Camera className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white/30' />
              )}
            </div>
            <p className='text-white text-center mt-6 mb-4'>
              {step === 1
                ? 'Capture front side of Aadhaar'
                : 'Capture back side (address)'}
            </p>
          </>
        ) : (
          <div className='w-full max-w-md'>
            <div className='relative w-full aspect-[3/2] border-4 border-dashed border-white/50 rounded-lg overflow-hidden bg-black/50 flex items-center justify-center'>
              <Upload className='w-24 h-24 text-white/30' />
            </div>
            <p className='text-white text-center mt-6 mb-4'>
              {step === 1
                ? 'Upload front side of Aadhaar card'
                : 'Upload back side (address)'}
            </p>
          </div>
        )}

        <canvas ref={canvasRef} className='hidden' />
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          capture={isMobile ? 'environment' : undefined}
          onChange={handleFileUpload}
          className='hidden'
        />

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
            {isMobile && isCameraActive ? (
              <Button
                onClick={captureImage}
                className='w-full bg-white text-black hover:bg-white/90 cursor-pointer'
                size='lg'
              >
                <Camera className='w-5 h-5 mr-2' />
                {step === 1 ? 'Capture Front' : 'Capture Back'}
              </Button>
            ) : (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className='w-full bg-white text-black hover:bg-white/90 cursor-pointer'
                size='lg'
              >
                <Upload className='w-5 h-5 mr-2' />
                {step === 1 ? 'Upload Front Side' : 'Upload Back Side'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
