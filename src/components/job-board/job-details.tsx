"use client"

import { Button } from "@/components/ui/button"
import { calculateProfileCompletion } from "@/lib/utils/profile-completion"
import * as Icons from "lucide-react"
import { StageBGateModal } from "./stage-b-gate-modal"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { setSelectedJob, setShowStageBGate } from "@/redux/slices/jobsSlice"
import { useRouter } from "next/navigation"

export default function JobDetails() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Get state from Redux
  const selectedJob = useAppSelector((state) => state.jobs.selectedJob)
  const showStageBGate = useAppSelector((state) => state.jobs.showStageBGate)
  const stageAData = useAppSelector((state) => state.jobs.stageAData)
  const stageBData = useAppSelector((state) => state.jobs.stageBData)
  const stageCData = useAppSelector((state) => state.jobs.stageCData)
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber)
  const username = useAppSelector((state) => state.auth.userName)
  const email = useAppSelector((state) => state.auth.user.Email)

  if (!selectedJob) return null

  const handleApply = () => {
    const completion = calculateProfileCompletion(
      phoneNumber || "",
      username || "",
      email || "",
      stageAData || {} as any,
      stageBData || {} as any,
      stageCData || {} as any
    )

    if (completion < 70) {
      dispatch(setShowStageBGate(true))
    } else {
      // TODO: Implement actual job application
      alert("Application submitted!")
    }
  }

  const handleBack = () => {
    dispatch(setSelectedJob(null))
    router.push('/dashboard')
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <Icons.ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Job Details</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-md mx-auto space-y-6">
            {/* Job Header */}
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold mb-1">{selectedJob.title}</h2>
              <p className="text-lg text-primary font-semibold mb-3">
                ₹{selectedJob.salaryMin} - ₹{selectedJob.salaryMax}
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icons.Briefcase className="w-4 h-4" />
                  <span>Full-time</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icons.MapPin className="w-4 h-4" />
                  <span>{selectedJob.distance} km away</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {selectedJob.company} • {selectedJob.location}
              </p>
            </div>

            {/* Job Description */}
            {selectedJob.description && (
              <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
                <h3 className="text-xl font-semibold">Job Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
            )}

            {/* Training Information */}
            {selectedJob.training && (
              <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
                <h3 className="text-xl font-semibold">Training Available</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedJob.training.type === 'csr' ? '🎓 Free Training (CSR)' : '📚 Paid Training'}
                    </span>
                    {selectedJob.training.cost > 0 && (
                      <span className="text-base font-semibold text-primary">
                        ₹{selectedJob.training.cost.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Provider:</strong> {selectedJob.training.provider}</p>
                    <p><strong>Duration:</strong> {selectedJob.training.duration}</p>
                    <p><strong>Mode:</strong> {selectedJob.training.mode === 'learn-first' ? 'Complete training before job' : selectedJob.training.mode === 'learn-on-job' ? 'Learn while working' : 'Both options available'}</p>
                  </div>
                  {selectedJob.training.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedJob.training.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
              <h3 className="text-xl font-semibold">Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Required Skill:</span>
                  <span className="text-sm text-muted-foreground">{selectedJob.requiredSkill}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Skill Level:</span>
                  {selectedJob.requiredSkillLevel === 'gray' ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                      No certification needed
                    </span>
                  ) : selectedJob.requiredSkillLevel === 'yellow' ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Verified skills needed
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Certification required
                    </span>
                  )}
                </div>
                {selectedJob.requirements.canApplyWithoutCert && (
                  <p className="text-sm text-muted-foreground">
                    ✓ You can apply without certification
                  </p>
                )}
                {selectedJob.requirements.mustCertifyFirst && (
                  <p className="text-sm text-orange-600">
                    ⚠ You must complete certification before applying
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-background">
          <Button onClick={handleApply} className="w-full h-12">
            Apply Now
          </Button>
        </div>
      </div>

      {showStageBGate && <StageBGateModal />}
    </>
  )
}
