"use client"

import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context/app-context"
import { calculateProfileCompletion } from "@/lib/utils/profile-completion"
import * as Icons from "lucide-react"
import { useState } from "react"
import { StageBGateModal } from "./stage-b-gate-modal"

export default function JobDetails() {
  const { selectedJob, setSelectedJob, phoneNumber, username, email, stageAData, stageBData, stageCData } = useApp()
  const [showStageBGate, setShowStageBGate] = useState(false)

  if (!selectedJob) return null

  const handleApply = () => {
    const completion = calculateProfileCompletion(phoneNumber, username, email, stageAData, stageBData, stageCData)

    if (completion < 70) {
      setShowStageBGate(true)
    } else {
      // TODO: Implement actual job application
      alert("Application submitted!")
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)} className="mr-2">
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
                ₹{selectedJob.salaryMin.toLocaleString()} - ₹{selectedJob.salaryMax.toLocaleString()}
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
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
              <h3 className="text-xl font-semibold">Job Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                We are looking for a skilled and motivated individual to join our team as a {selectedJob.title}. The
                ideal candidate will have a strong understanding of {selectedJob.requiredSkill} and experience in
                relevant industries. This role involves various responsibilities. Join us and be part of a dynamic and
                growing company.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
              <h3 className="text-xl font-semibold">Requirements</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Proven experience in {selectedJob.requiredSkill}.</li>
                <li>Knowledge of industry best practices.</li>
                <li>Ability to work in a team environment.</li>
                <li>Good communication skills.</li>
                <li>Willingness to learn and adapt.</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
              <h3 className="text-xl font-semibold">Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Competitive salary.</li>
                <li>Opportunities for training and skill development.</li>
                <li>Positive work environment.</li>
                <li>Potential for career growth.</li>
              </ul>
            </div>

            {/* Company Info */}
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
              <h3 className="text-xl font-semibold">About the Company</h3>
              <p className="text-muted-foreground leading-relaxed">
                {selectedJob.company} is a leading provider in the industry. We are committed to excellence and
                providing opportunities for growth and development.
              </p>
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
