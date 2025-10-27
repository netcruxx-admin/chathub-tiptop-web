"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Scan, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export default function AadhaarScanOffer() {
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{t('aadhaarScan.title')}</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="max-w-md mx-auto w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scan className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-4">{t('aadhaarScan.heading')}</h2>

          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-muted-foreground">{t('aadhaarScan.benefit1')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-muted-foreground">{t('aadhaarScan.benefit2')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowRight className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-muted-foreground">{t('aadhaarScan.benefit3')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push("/aadhaar-camera")} className="w-full h-12 cursor-pointer">
              <Scan className="w-5 h-5 mr-2" />
              {t('aadhaarScan.scanButton')}
            </Button>
            <Button variant="outline" onClick={() => router.push("/form-based-profile")} className="w-full h-12 cursor-pointer">
              {t('aadhaarScan.skipButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
