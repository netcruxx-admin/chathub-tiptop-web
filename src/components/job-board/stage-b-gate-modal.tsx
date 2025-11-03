"use client"

import { Button } from "@/components/ui/button"
// import { useApp } from "@/lib/context/app-context"
// import { useTranslation } from "@/lib/i18n/use-translation"
// import { calculateProfileCompletion } from "@/lib/utils/profile-completion"
import * as Icons from "lucide-react"
import { useTranslations } from "next-intl"

export function StageBGateModal() {
  const { phoneNumber, username, email, stageAData, stageBData, stageCData, setCurrentScreen, setSelectedJob } =
    useApp()
  const t = useTranslations()

  const completion = calculateProfileCompletion(phoneNumber, username, email, stageAData, stageBData, stageCData)

  const handleCompleteProfile = () => {
    setSelectedJob(null)
    setCurrentScreen("profile")
  }

  const handleCancel = () => {
    setSelectedJob(null)
  }

  const missingItems = []
  if (!stageBData?.sex) missingItems.push(t?.profile?.gender ?? "Gender")
  if (!stageBData?.aadhaarNumber) missingItems.push(t?.profile?.aadhaar ?? "Aadhaar Number")
  if (!stageBData?.currentAddress?.line1) missingItems.push(t?.profile?.currentAddress ?? "Current Address")
  if (!stageBData?.permanentAddress?.line1) missingItems.push(t?.profile?.permanentAddress ?? "Permanent Address")
  if (!stageBData?.highestQualification) missingItems.push(t?.profile?.qualification ?? "Qualification")
  if (
    stageBData?.hasExperience === undefined ||
    (stageBData?.hasExperience && stageBData?.workExperience?.length === 0)
  )
    missingItems.push(t?.profile?.workExperience ?? "Work Experience")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mx-auto mb-4">
          <Icons.Lock className="w-8 h-8 text-orange-600" />
        </div>

        <h2 className="text-xl font-bold text-center mb-2">
          {t?.jobs?.completeProfileToApply ?? "Complete Your Profile to Apply"}
        </h2>

        <p className="text-sm text-muted-foreground text-center mb-4">
          {t?.jobs?.profileCompletionRequired ??
            "You need to complete at least 70% of your profile before applying for jobs. This helps employers understand your qualifications better."}
        </p>

        <div className="bg-muted rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{t?.profile?.profileCompletion ?? "Profile Completion"}</span>
            <span className="text-sm font-bold text-primary">{completion}%</span>
          </div>
          <div className="w-full bg-background rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t?.jobs?.needMoreCompletion ?? `You need ${70 - completion}% more to apply for jobs`}
          </p>
        </div>

        {missingItems.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">{t?.jobs?.missingInformation ?? "Missing Information:"}</p>
            <ul className="space-y-1">
              {missingItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icons.Circle className="w-1.5 h-1.5 fill-current" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
            {t?.common?.cancel ?? "Cancel"}
          </Button>
          <Button onClick={handleCompleteProfile} className="flex-1">
            {t?.jobs?.completeNow ?? "Complete Now"}
            <Icons.ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
