"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useFormik } from 'formik'
// import { createAadhaarReviewValidation } from '@/lib/validation/authValidation'
// import type { AadhaarReviewValidationValues } from '@/types/validation'

interface AadhaarData {
  firstName?: string
  lastName?: string
  name?: string
  dob: string
  gender?: string
  address: string
  aadhaarNumber: string
}

export default function AadhaarReview() {
  const router = useRouter()
  const t = useTranslations()

  const [ocrScannedData, setOcrScannedData] = useState<AadhaarData | null>(null)

  const formik = useFormik<AadhaarReviewValidationValues>({
    initialValues: {
      gender: '',
    },
    // validationSchema: createAadhaarReviewValidation(t),
    onSubmit: (values) => {
      if (!ocrScannedData) return

      const fullName = ocrScannedData.name || `${ocrScannedData.firstName} ${ocrScannedData.lastName}`
      const nameParts = fullName.split(" ")
      const firstName = ocrScannedData.firstName || nameParts[0] || ""
      const lastName = ocrScannedData.lastName || nameParts[nameParts.length - 1] || ""
      const middleName = nameParts.slice(1, -1).join(" ") || ""

      // Save the confirmed data
      const confirmedData = {
        firstName,
        middleName,
        lastName,
        dateOfBirth: ocrScannedData.dob,
        permanentAddress: ocrScannedData.address,
        aadhaarNumber: ocrScannedData.aadhaarNumber,
        gender: values.gender,
      }

      // Save merged data
      localStorage.setItem('profileData', JSON.stringify(confirmedData))
      localStorage.setItem('confirmedAadhaarData', JSON.stringify(confirmedData))

      // Determine where to return based on onboarding flow
      const onboardingFlow = localStorage.getItem('onboardingFlow')
      if (onboardingFlow === 'form') {
        // Set flag to indicate data should be pre-filled
        localStorage.setItem('aadhaarDataConfirmed', 'true')
        // Return to form-based profile with pre-filled data
        router.push('/form-based-profile')
      } else if (onboardingFlow === 'resume') {
        // Return to resume review with merged data
        router.push('/resume-review')
      } else {
        // Default: continue to skills wizard
        router.push('/skills-wizard')
      }
    },
  })

  useEffect(() => {
    // Load scanned data from localStorage
    const savedData = localStorage.getItem('aadhaarData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setOcrScannedData(parsed)
      // Pre-fill gender if extracted from OCR
      if (parsed.gender) {
        formik.setFieldValue('gender', parsed.gender)
      }
    } else {
      // If no data, redirect back to scan
      router.push('/aadhaar-scan')
    }
  }, [router])

  const genderOptions = [
    { value: "male", label: t('aadhaarReview.male') },
    { value: "female", label: t('aadhaarReview.female') },
    { value: "transgender", label: t('aadhaarReview.transgender') },
    { value: "prefer-not-to-say", label: t('aadhaarReview.preferNotToSay') },
  ]


  if (!ocrScannedData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const displayName = ocrScannedData.name || `${ocrScannedData.firstName} ${ocrScannedData.lastName}`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push('/aadhaar-scan')} className="mr-2 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{t('aadhaarReview.title')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-bold">{t('aadhaarReview.heading')}</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t('aadhaarReview.name')}</p>
              <p className="font-semibold">{displayName}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">{t('aadhaarReview.dob')}</p>
              <p className="font-semibold">{ocrScannedData.dob}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">{t('aadhaarReview.gender')}</p>
              <div className="grid grid-cols-2 gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => formik.setFieldValue('gender', option.value)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm cursor-pointer ${
                      formik.values.gender === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <p className='text-xs text-destructive mt-2'>{formik.errors.gender}</p>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t('aadhaarReview.address')}</p>
              <p className="font-semibold">{ocrScannedData.address}</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t('aadhaarReview.aadhaar')}</p>
              <p className="font-semibold">{ocrScannedData.aadhaarNumber}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => formik.handleSubmit()}
              className="w-full h-12 cursor-pointer"
              disabled={!formik.values.gender || !formik.isValid}
            >
              {t('aadhaarReview.confirm')}
            </Button>
            <Button variant="outline" onClick={() => router.push('/aadhaar-camera')} className="w-full h-12 cursor-pointer">
              {t('aadhaarReview.rescan')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
